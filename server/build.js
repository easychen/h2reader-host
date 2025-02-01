import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

async function build() {
  try {
    // 1. 构建前端项目
    console.log('Building frontend...');
    try {
      const { stdout, stderr } = await execAsync('cd ../web && yarn install && yarn build');
      if (stderr) console.error('Frontend build warnings:', stderr);
      if (stdout) console.log('Frontend build output:', stdout);
    } catch (error) {
      console.error('Frontend build failed:', error.message);
      process.exit(1);
    }

    // 2. 创建必要的目录
    const distDir = join(__dirname, 'dist');
    const apiDir = join(distDir, 'api');
    await fs.mkdir(apiDir, { recursive: true });

    // 3. 检查前端构建文件是否存在
    const webDistDir = join(__dirname, '../web/build');
    try {
      await fs.access(webDistDir);
    } catch (error) {
      console.error('Frontend build directory not found:', webDistDir);
      console.error('Please make sure the frontend build completed successfully');
      process.exit(1);
    }

    // 4. 复制前端构建文件到 server/dist
    console.log('Copying frontend build files...');
    await fs.cp(webDistDir, distDir, { recursive: true });

    // 5. 复制后端文件到 dist/api
    console.log('Copying backend files...');
    await fs.copyFile(
      join(__dirname, 'index.js'),
      join(apiDir, 'index.js')
    );

    // 6. 复制 package.json 和其他必要文件
    await fs.copyFile(
      join(__dirname, 'package.json'),
      join(apiDir, 'package.json')
    );

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 