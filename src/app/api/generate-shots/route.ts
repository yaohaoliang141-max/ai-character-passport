import { NextResponse } from 'next/server';

export const maxDuration = 60; // Allow up to 60s for LLM generation

export async function POST(req: Request) {
  try {
    const { script, frames, character, characterImage, settings } = await req.json();

    if ((!script && !frames) || !settings?.apiKey) {
      return NextResponse.json({ error: '缺少输入源（剧本或视频）或 API Key' }, { status: 400 });
    }

    let systemPrompt = `你是一位专业的动画导演和分镜师。你的任务是将用户提供的剧本或视频参考，拆解或转化为多个连续的分镜镜头。
要求：
1. 每个镜头时长大约在 10-15 秒之间，适合在 AI 视频生成平台（如即梦、Veo）上生成。
2. 每个镜头必须包含：
   - 镜头序号 (shotNumber)
   - 估算时长 (duration, 如 "10s")
   - 画面提示词 (prompt)：必须融合电影级的光影和运镜指令。如果用户指定了角色特征或上传了角色参考图，必须将目标角色的外貌特征巧妙地融入到每一段提示词中，以保证角色一致性。如果用户提供了视频截图序列，你需要**极其精准地模仿**原视频的构图、运镜、动作节奏和情节发展，但是**必须将画面中的主角替换为用户指定的目标角色**。提示词应当是一段英文，用逗号分隔短语最佳（ComfyUI / Jimeng 风格）。
   - 旁白/台词 (narration)：对应这个镜头的原文内容或根据视频画面生成的适当旁白，使用中文。
3. 必须严格输出 JSON 格式。不要输出任何 Markdown 代码块包裹（如 \`\`\`json），直接输出一个 JSON 数组。

设定的角色特征文字参考：
名称：${character?.name || '未指定'}
基础设定：${character?.basePrompt || '未指定'}
外观标签：${character?.appearanceTags || '未指定'}
光影与风格：${character?.styleLighting || '未指定'}
`;

    const messages: any[] = [{ role: 'system', content: systemPrompt }];

    if (frames && frames.length > 0) {
      // Vision payload
      const content: any[] = [
        { type: 'text', text: '请根据以下连续的视频截图序列提取分镜。请模仿画面的构图、动作、运镜、情节发展，将其拆分为连续的 10-15秒分镜。注意：如果在上下文中提供了目标角色的参考图或文字描述，请务必将画面中的主要人物替换为目标角色。返回 JSON 数组格式的分镜。' }
      ];

      if (characterImage) {
        content.push({ type: 'text', text: '以下是目标角色的参考图，请在提示词中替换为此角色的外貌：' });
        content.push({
          type: 'image_url',
          image_url: { url: characterImage, detail: 'low' }
        });
        content.push({ type: 'text', text: '以下是从参考视频中提取的关键帧：' });
      }
      
      frames.forEach((f: any) => {
        content.push({
          type: 'image_url',
          image_url: {
            url: f.dataUrl,
            detail: 'low' // Save tokens
          }
        });
      });
      
      messages.push({ role: 'user', content });
    } else {
      // Text-only payload
      const content: any[] = [
        { type: 'text', text: `请将以下剧本拆解为分镜（直接返回 JSON 数组）：\n\n${script}` }
      ];
      if (characterImage) {
        content.push({ type: 'text', text: '以下是目标角色的参考图，请在提示词中充分融合此角色的外貌特征：' });
        content.push({
          type: 'image_url',
          image_url: { url: characterImage, detail: 'low' }
        });
      }
      messages.push({ role: 'user', content });
    }

    const response = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('LLM API Error:', errorData);
      
      let errorMessage = '大模型 API 请求失败。';
      if (errorData?.error?.message) {
        errorMessage = `API 返回错误: ${errorData.error.message}`;
      } else if (errorData?.message) {
        errorMessage = `API 返回错误: ${errorData.message}`;
      }
      
      return NextResponse.json({ error: errorMessage, details: errorData }, { status: response.status });
    }

    const data = await response.json();
    let contentStr = data.choices[0]?.message?.content || '[]';
    
    // Clean up potential markdown code blocks
    contentStr = contentStr.replace(/^```json/m, '').replace(/^```/m, '').trim();
    if (contentStr.startsWith('```')) {
      contentStr = contentStr.replace(/```$/, '').trim();
    }

    let parsedShots;
    try {
      parsedShots = JSON.parse(contentStr);
      if (!Array.isArray(parsedShots)) {
         // Attempt to extract if it was wrapped in an object like { "shots": [...] }
         parsedShots = parsedShots.shots || [];
      }
    } catch (e) {
      console.error('Failed to parse JSON from LLM:', contentStr);
      return NextResponse.json({ error: 'Failed to parse JSON from LLM response' }, { status: 500 });
    }

    return NextResponse.json({ shots: parsedShots });

  } catch (error: any) {
    console.error('Generate Shots Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
