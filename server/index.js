import express from 'express';
import cors from 'cors';
import { put } from '@vercel/blob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const isVercel = process.env.VERCEL === '1';

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// 静态文件服务
app.use(express.static(join(__dirname, '../')));

// // 创建上传端点
// app.post('/api/upload', async (req, res) => {
//   try {
//     if (!req.files || !req.files.file) {
//       return res.status(400).send('No file uploaded');
//     }

//     const file = req.files.file;
//     const fileName = file.name;
//     const fileContent = file.data.toString();

//     if (isVercel) {
//       // 使用 Vercel Blob 存储
//       const blob = await put(fileName, fileContent, {
//         access: 'public',
//         token: process.env.BLOB_READ_WRITE_TOKEN,
//         contentType: 'application/json',
//         addRandomSuffix: false
//       });
      
//       res.json({ 
//         success: true, 
//         url: blob.url,
//         message: 'File uploaded successfully to Vercel Blob' 
//       });
//     } else {
//       // 本地存储
//       const uploadDir = join(__dirname, '../uploads');
//       await fs.mkdir(uploadDir, { recursive: true });
//       await fs.writeFile(
//         join(uploadDir, fileName),
//         fileContent
//       );
      
//       res.json({ 
//         success: true,
//         url: `/uploads/${fileName}`,
//         message: 'File uploaded successfully to local storage'
//       });
//     }
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error uploading file',
//       error: error.message 
//     });
//   }
// });

// // 获取文件列表端点
// app.get('/api/files', async (req, res) => {
//   try {
//     if (isVercel) {
//       // TODO: 实现 Vercel Blob 列表获取
//       res.json({ files: [] });
//     } else {
//       const uploadDir = join(__dirname, '../uploads');
//       await fs.mkdir(uploadDir, { recursive: true });
//       const files = await fs.readdir(uploadDir);
//       res.json({ files });
//     }
//   } catch (error) {
//     console.error('Error getting files:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error getting file list',
//       error: error.message 
//     });
//   }
// });

// 定义处理函数
const handleUpload = async (req, res) => {
  try {
    // 验证上传密钥
    const uploadKey = req.body.upload_key;
    const serverUploadKey = process.env.UPLOAD_KEY;
    
    if (serverUploadKey && (!uploadKey || uploadKey !== serverUploadKey)) {
      return res.status(403).json({
        code: 99,
        message: '上传密钥无效'
      });
    }

    if (!req.files || !req.files.book) {
      return res.status(400).json({
        code: 99,
        message: 'No file uploaded'
      });
    }

    const file = req.files.book;
    const fileName = file.name;
    const fileContent = file.data;
    const id = Date.now() + '-' + Math.floor(Math.random() * 999999);
    const newFileName = `${id}.h2book`;

    if (isVercel) {
      // 使用 Vercel Blob 存储
      const blob = await put(newFileName, fileContent, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/octet-stream',
        addRandomSuffix: false
      });
      
      res.json({
        code: 0,
        message: 'File uploaded successfully',
        data: {
          url: blob.url,
          id: id
        }
      });
    } else {
      // 本地存储
      const uploadDir = join(__dirname, '../books');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(
        join(uploadDir, newFileName),
        fileContent
      );
      
      // 获取站点 URL
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers['x-forwarded-host'] || req.get('host');
      const siteUrl = `${protocol}://${host}`;
      
      res.json({
        code: 0,
        message: 'File uploaded successfully',
        data: {
          url: `${siteUrl}/books/${newFileName}`,
          id: id
        }
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      code: 99,
      message: 'Error uploading file: ' + error.message
    });
  }
};

// 两个路由共用同一个处理函数
app.post('/api/upload', handleUpload);
app.post('/api.php', handleUpload);

// 所有其他路由都返回 index.html（支持前端路由）
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../index.html'));
});

// 启动服务器（仅在非 Vercel 环境下）
if (!isVercel) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// 为 Vercel 导出
export default app; 