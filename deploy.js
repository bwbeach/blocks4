#!/usr/bin/env node

/**
 * Deployment script for Glass Block Designer
 * Uploads static site files to server via FTP
 */

import { Client } from 'basic-ftp';
import fs from 'fs';
import path from 'path';

// Configuration from environment variables
const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_REMOTE_PATH = process.env.FTP_REMOTE_PATH;
const FTP_PORT = process.env.FTP_PORT || 21;

// Source directory containing all files to deploy
const SRC_DIR = 'src';

async function deploy() {
    // Validate configuration
    if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_REMOTE_PATH) {
        console.error('❌ Missing required environment variables:');
        console.error('   FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_PATH must be set');
        console.error('');
        console.error('Example usage:');
        console.error('   FTP_HOST=ftp.example.com FTP_USER=username FTP_PASSWORD=password FTP_REMOTE_PATH=/path/to/remote/dir npm run deploy');
        process.exit(1);
    }

    const client = new Client();

    try {
        console.log('🚀 Starting deployment...');
        console.log(`📡 Connecting to ${FTP_HOST}:${FTP_PORT}...`);

        await client.access({
            host: FTP_HOST,
            port: FTP_PORT,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: false
        });

        console.log('✅ Connected successfully');

        // Change to remote directory if specified
        console.log(`📁 Changing to remote directory: ${FTP_REMOTE_PATH}`);
        await client.ensureDir(FTP_REMOTE_PATH);

        // Check if src directory exists
        if (!fs.existsSync(SRC_DIR)) {
            throw new Error(`Source directory '${SRC_DIR}' not found`);
        }

        // Get all files in src directory
        const files = fs.readdirSync(SRC_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);

        if (files.length === 0) {
            console.warn(`⚠️  Warning: No files found in ${SRC_DIR} directory`);
            return;
        }

        console.log(`📦 Found ${files.length} files to deploy from ${SRC_DIR}/`);

        // Upload each file
        for (const file of files) {
            const localPath = path.join(SRC_DIR, file);
            console.log(`📤 Uploading ${file}...`);
            await client.uploadFrom(localPath, file);
            console.log(`✅ ${file} uploaded successfully`);
        }

        console.log('');
        console.log('🎉 Deployment completed successfully!');
        console.log(`📋 ${files.length} files uploaded to ${FTP_HOST}${FTP_REMOTE_PATH}`);

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    } finally {
        client.close();
    }
}

// Run deployment
deploy().catch(console.error); 