"""
ポモドーロタイマー Flask アプリケーション
"""
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig, TestingConfig, ProductionConfig
import os

db = SQLAlchemy()


def create_app(config=None):
    """
    Flask アプリケーションファクトリ
    
    Args:
        config: 設定クラス（省略時は環境変数 FLASK_ENV から判定）
    
    Returns:
        Flask アプリケーションインスタンス
    """
    app = Flask(__name__)
    
    # 設定の決定
    if config is None:
        env = os.environ.get('FLASK_ENV', 'development')
        if env == 'testing':
            config = TestingConfig
        elif env == 'production':
            config = ProductionConfig
        else:
            config = DevelopmentConfig
    
    app.config.from_object(config)
    
    # DB 初期化
    db.init_app(app)
    
    # ルート登録
    @app.route('/')
    def index():
        return render_template('index.html')
    
    # コンテキストプロセッサ
    @app.shell_context_processor
    def make_shell_context():
        return {'db': db}
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
