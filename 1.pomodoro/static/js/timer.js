/**
 * ポモドーロタイマー - コアロジック
 * DOM に非依存なタイマークラス
 */

export class PomodoroTimer {
    /**
     * @param {number} workDuration - 作業時間（秒）
     * @param {number} shortBreakDuration - 短休憩時間（秒）
     * @param {number} longBreakDuration - 長休憩時間（秒）
     * @param {number} sessionsBeforeLongBreak - 長休憩までのセッション数
     */
    constructor(
        workDuration = 25 * 60,
        shortBreakDuration = 5 * 60,
        longBreakDuration = 15 * 60,
        sessionsBeforeLongBreak = 4
    ) {
        this.workDuration = workDuration;
        this.shortBreakDuration = shortBreakDuration;
        this.longBreakDuration = longBreakDuration;
        this.sessionsBeforeLongBreak = sessionsBeforeLongBreak;

        this.mode = 'work'; // 'work' | 'short_break' | 'long_break'
        this.remainingSeconds = workDuration;
        this.sessionCount = 0;
        this.isRunning = false;
        this.intervalId = null;
    }

    /**
     * タイマーを開始
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * タイマーを一時停止
     */
    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * タイマーをリセット
     */
    reset() {
        this.pause();
        this.mode = 'work';
        this.remainingSeconds = this.workDuration;
        this.isRunning = false;
    }

    /**
     * 1秒進める（内部用）
     */
    tick() {
        if (this.remainingSeconds <= 0) {
            this.switchMode();
            return;
        }

        this.remainingSeconds--;
    }

    /**
     * モードを切り替える
     */
    switchMode() {
        if (this.mode === 'work') {
            this.sessionCount++;
            if (this.sessionCount % this.sessionsBeforeLongBreak === 0) {
                this.mode = 'long_break';
                this.remainingSeconds = this.longBreakDuration;
            } else {
                this.mode = 'short_break';
                this.remainingSeconds = this.shortBreakDuration;
            }
        } else {
            this.mode = 'work';
            this.remainingSeconds = this.workDuration;
        }
    }

    /**
     * 状態を取得
     */
    getState() {
        return {
            mode: this.mode,
            remainingSeconds: this.remainingSeconds,
            sessionCount: this.sessionCount,
            isRunning: this.isRunning,
        };
    }

    /**
     * 現在のモード名を日本語で取得
     */
    getModeName() {
        const modeNames = {
            work: '作業中',
            short_break: '短休憩',
            long_break: '長休憩',
        };
        return modeNames[this.mode];
    }

    /**
     * 残り時間を MM:SS 形式で取得
     */
    getTimeString() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
