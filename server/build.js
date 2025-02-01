import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { copy, remove, ensureDir } from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
  try {
    // 清理 dist 目录
    const distDir = join(__dirname, 'dist');
    await remove(distDir);
    await ensureDir(distDir);

    // 复制服务器文件
    const serverFiles = ['index.js', 'package.json', 'vercel.json'];
    for (const file of serverFiles) {
      await fs.copyFile(join(__dirname, file), join(distDir, file));
    }

    // 创建前端构建目录
    const publicDir = join(distDir, 'public');
    await ensureDir(publicDir);

    // 构建前端（假设前端在 ../web 目录）
    console.log('Building frontend...');
    const webDir = join(__dirname, '..', 'web');
    process.chdir(webDir);
    const { execSync } = await import('child_process');
    execSync('yarn install', { stdio: 'inherit' });
    execSync('yarn build', { stdio: 'inherit' });

    // 复制前端构建文件到 server/dist/public
    await copy(join(webDir, 'build'), publicDir);

    // 安装服务器依赖
    console.log('Installing server dependencies...');
    process.chdir(distDir);
    execSync('yarn install --production', { stdio: 'inherit' });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// 执行构建
build(); 