/**
 * Flask API 通信
 */

/**
 * 設定を取得
 */
export async function getSettings() {
    try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to get settings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

/**
 * 設定を保存
 */
export async function saveSettings(settings) {
    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings),
        });
        if (!response.ok) throw new Error('Failed to save settings');
        return await response.json();
    } catch (error) {
        console.error('Error saving settings:', error);
        return null;
    }
}

/**
 * セッション履歴を取得
 */
export async function getSessions() {
    try {
        const response = await fetch('/api/sessions');
        if (!response.ok) throw new Error('Failed to get sessions');
        return await response.json();
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return [];
    }
}

/**
 * セッション完了を記録
 */
export async function createSession(sessionData) {
    try {
        const response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });
        if (!response.ok) throw new Error('Failed to create session');
        return await response.json();
    } catch (error) {
        console.error('Error creating session:', error);
        return null;
    }
}
