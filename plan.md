# ポモドーロタイマー 段階的実装計画

## Phase 1: プロジェクト基盤の構築
**目標**: アプリが起動し、空のページが表示される状態

- [ ] ディレクトリ構造の作成（`services/`, `repositories/`, `tests/`, `static/`, `templates/`）
- [ ] `requirements.txt` の作成（Flask, pytest, Flask-SQLAlchemy）
- [ ] `config.py` の実装（`DevelopmentConfig` / `TestingConfig`）
- [ ] `create_app()` ファクトリの実装
- [ ] `GET /` でHTMLを返す最小限のルート
- [ ] `index.html` の骨格作成

---

## Phase 2: タイマーのコアロジック（フロントエンド）
**目標**: ブラウザ上でタイマーが動作する状態（サーバー不要）

- [ ] `timer.js` — `PomodoroTimer` クラスの実装
  - カウントダウン、開始・一時停止・リセット
  - セッション種別の自動切替ロジック
  - セッションカウンター管理
- [ ] `ui.js` — タイマー表示の DOM 更新
- [ ] `style.css` — 基本レイアウト・モード別スタイル
- [ ] タブタイトルへの残り時間表示

---

## Phase 3: サーバーサイドの実装
**目標**: 設定とセッション履歴をDBに保存できる状態

- [ ] `models.py` — `Settings` / `Session` モデル定義
- [ ] `repositories/session_repository.py` — DB アクセス層
- [ ] `services/session_service.py` — ビジネスロジック層
- [ ] API エンドポイントの実装
  - `GET/POST /api/settings`
  - `GET/POST /api/sessions`
- [ ] `api.js` — fetch ラッパーの実装
- [ ] ページロード時に設定をサーバーから取得する処理

---

## Phase 4: UI/UX の仕上げ
**目標**: ユーザーが使いやすい完成状態

- [ ] セッション完了通知（ブラウザ通知 API）
- [ ] プログレスバーまたは円形インジケーター
- [ ] 設定変更 UI（モーダルまたはフォーム）
- [ ] セッション履歴の一覧表示

---

## Phase 5: テストの整備
**目標**: 各レイヤーのユニットテストが通る状態

- [ ] `test_session_service.py` — モックリポジトリを使ったサービス層テスト
- [ ] `test_session_repository.py` — インメモリ SQLite を使ったリポジトリ層テスト
- [ ] `test_routes.py` — Flask test client を使ったルートテスト
- [ ] `timer.test.js` — Jest による `PomodoroTimer` クラスのテスト

---

## フェーズの依存関係

```
Phase 1（基盤）
    ↓
Phase 2（JSタイマー）← フロントのみで完結、Phase 3 と並行可
    ↓
Phase 3（サーバー）
    ↓
Phase 4（UI仕上げ）
    ↓
Phase 5（テスト）← 各 Phase 完了後に随時追加も可
```

**注**: Phase 5 のテストは「最後にまとめて」ではなく、各 Phase 完了のタイミングで並行して書くと手戻りが少なくなります。
