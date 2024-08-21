# nicoarch-app

[nicoarch](https://github.com/tksnnx/nicoarch.git)<br/>
[nicoarch-worker](https://github.com/tksnnx/nicoarch-worker.git)

ニコニコ動画のアーカイブツールnicoarchのフロントエンド部分

## 使い方

### production

1. [nicoarch](https://github.com/tksnnx/nicoarch.git)の`docker-compose.yml`を用いてツールを起動する。

### development

1. [nicoarch](https://github.com/tksnnx/nicoarch.git)の`docker-compose.dev.yml`を用いて
   redisとmongoサーバーを起動する。
2. 下記コマンドを実行し、開発サーバーを起動する。
   ```sh
   pnpm install
   pnpm run dev
   ```

## ライセンス

[MIT License](LICENSE)
