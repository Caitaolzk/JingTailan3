// 加载环境变量（必须写在最开头）
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/genai');
const path = require('path');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 5000;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json({ limit: '10mb' })); // 解析JSON请求，支持大图片

// 初始化Gemini AI客户端（密钥从后端环境变量读取，前端完全看不到）
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 核心接口：代理所有Gemini请求
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, images } = req.body;

    // 检查参数
    if (!prompt) {
      return res.status(400).json({ error: '请输入提示词' });
    }

    // 构建请求内容
    const contents = [prompt];
    
    // 如果有图片，添加到请求中
    if (images && images.length > 0) {
      images.forEach(image => {
        contents.push({
          inlineData: {
            data: image.base64,
            mimeType: image.mimeType
          }
        });
      });
    }

    // 调用Gemini API
    const result = await model.generateContent(contents);
    const response = await result.response;
    const text = response.text();

    // 返回结果给前端
    res.json({ success: true, text: text });

  } catch (error) {
    console.error('Gemini API调用失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '服务器错误', 
      message: error.message 
    });
  }
});

// 生产环境：自动托管前端静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // 所有其他请求都返回index.html（单页应用路由）
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 后端服务器运行在: http://localhost:${PORT}`);
});