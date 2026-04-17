"""
設定ファイル - 環境別の設定を定義
"""
import os
from pathlib import Path


class Config:
    """基本設定"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')


class DevelopmentConfig(Config):
    """開発環境用設定"""
    DEBUG = True
    db_path = Path(__file__).parent / 'instance' / 'pomodoro.db'
    db_path.parent.mkdir(exist_ok=True)
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'


class TestingConfig(Config):
    """テスト環境用設定"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


class ProductionConfig(Config):
    """本番環境用設定"""
    DEBUG = False
    db_path = Path(__file__).parent / 'instance' / 'pomodoro.db'
    db_path.parent.mkdir(exist_ok=True)
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'
