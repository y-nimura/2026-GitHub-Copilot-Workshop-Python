# ポモドーロタイマー Webアプリケーション アーキテクチャ案

## ディレクトリ構成

```
1.pomodoro/
├── app.py                      # Flask ルーティングのみ（薄く保つ）
├── models.py                   # DB モデル定義
├── config.py                   # 環境別設定（Dev / Test / Prod）
├── services/
│   └── session_service.py      # ビジネスロジック（Flask に非依存）
├── repositories/
│   └── session_repository.py   # DB アクセスの抽象化
├── tests/
│   ├── test_routes.py
│   ├── test_session_service.py
│   └── test_session_repository.py
├── requirements.txt
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── timer.js            # Timer クラス（DOM 非依存なロジック）
│       ├── ui.js               # DOM 操作のみ
│       └── api.js              # fetch ラッパー
└── templates/
    └── index.html
```

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| バックエンド | Python / Flask |
| フロントエンド | HTML / CSS / JavaScript（バニラ） |
| データベース | SQLite（`sqlite3` または `Flask-SQLAlchemy`） |
| テスト（Python） | pytest |
| テスト（JS） | Jest |

---

## バックエンド設計

### API エンドポイント

| エンドポイント | メソッド | 役割 |
|---|---|---|
| `/` | GET | メイン画面を返す |
| `/api/settings` | GET | タイマー設定の取得 |
| `/api/settings` | POST | タイマー設定の保存 |
| `/api/sessions` | GET | 過去のセッション履歴の取得 |
| `/api/sessions` | POST | セッション完了記録の保存 |

### アプリファクトリパターン

テスト時に設定を差し替えられるよう、`create_app()` ファクトリ関数を使用する。

```python
# app.py
def create_app(config=None):
    app = Flask(__name__)
    app.config.from_object(config or 'config.DevelopmentConfig')
    # ルート登録
    return app
```

- `DevelopmentConfig`: SQLite ファイルを使用
- `TestingConfig`: インメモリ SQLite（`:memory:`）を使用し、本番 DB を汚染しない

### レイヤー分離と依存性注入（DI）

ビジネスロジックは `services/` に集約し、Flask に依存しない純粋な Python クラスとして実装する。  
DB アクセスはリポジトリ層で抽象化し、テスト時はモックリポジトリを注入できるようにする。

```python
# services/session_service.py
class SessionService:
    def __init__(self, repository):  # リポジトリを外から注入
        self.repo = repository

    def complete_session(self, duration: int, mode: str) -> dict:
        # ビジネスロジックのみ、DB 実装に非依存
        ...
```

---

## フロントエンド設計

### タイマーの状態管理

タイマーのカウントダウンはクライアントサイドで完結させる（`setInterval` 使用）。  
サーバーへの通信はセッション完了時のみ行い、ネットワーク遅延の影響を排除する。

```javascript
// 状態
{
  mode: 'work' | 'short_break' | 'long_break',
  remainingSeconds: number,
  sessionCount: number,
  isRunning: boolean
}
```

### JS ファイルの責務分離

| ファイル | 責務 |
|---|---|
| `timer.js` | `PomodoroTimer` クラス。DOM に非依存なタイマーロジック。Node.js 環境（Jest）でテスト可能 |
| `ui.js` | DOM 操作のみ。`timer.js` のイベントを受けて画面を更新する |
| `api.js` | Flask API への `fetch` リクエストをラップする関数群 |

```javascript
// timer.js（DOM 非依存）
export class PomodoroTimer {
    constructor(workDuration, breakDuration) { ... }
    start() { ... }
    pause() { ... }
    tick() { ... }  // 純粋に状態を更新するだけ
}
```

---

## テスト戦略

| 対象 | ツール | 内容 |
|---|---|---|
| サービス層 | pytest | Flask 未起動でビジネスロジックを単体テスト |
| ルート層 | pytest + Flask test client | `TestingConfig` でインメモリ DB を使用 |
| リポジトリ層 | pytest | インメモリ SQLite で DB 操作を検証 |
| JS タイマーロジック | Jest | `PomodoroTimer` クラスを DOM なしでテスト |

---

## 設計判断の根拠

- **タイマーはブラウザ側で管理**: ネットワーク遅延の影響を受けず精度が高い
- **設定・履歴はサーバーで永続化**: ページリロード後も状態を維持できる
- **SQLite**: 追加インフラ不要でシンプルな履歴管理に適切
- **レイヤー分離 + DI**: Flask を起動せずにビジネスロジックを高速にテストできる
- **ファクトリパターン**: 環境ごとの設定切替が容易で、テスト時の DB 汚染を防ぐ
