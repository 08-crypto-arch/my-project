# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリにはビルドツールやフレームワークを使わない、純粋な HTML/CSS/JavaScript プロジェクトが含まれています。ブラウザで直接ファイルを開いて動作します。

## プロジェクト構成

### `index.html` / ルートディレクトリ
電卓カスタマイザー（電卓組み立てキット）のメイン単一ファイル版。React 18・Babel Standalone を CDN から読み込み、`<script type="text/babel">` 内にすべてのコンポーネントをインラインで記述。

### `calculator-kit/`
同じ電卓カスタマイザーのソース分割版（開発用）。ただし実際のバンドル処理はなく、`index.html` が CDN の React + Babel を利用して JSX を実行時コンパイルする。

- `palettes.jsx` — カラーパレット・マテリアル・シェイプ・フォント等の定数定義
- `calculator.jsx` — `Calculator` コンポーネント（計算ロジック＋レンダリング）
- `controls.jsx` — `ControlsPanel` および補助 UI コンポーネント（`Segmented`, `Slider` 等）
- `app.jsx` — `App` ルートコンポーネント、`DEFAULTS`・`PRESETS` 定義、`ReactDOM.createRoot` の呼び出し

### `mysite/nail-salon/`
ネイルサロン「Petal Nail」のランディングページ。純粋な HTML/CSS/JS の単一ファイル。Google Fonts と Unsplash 画像を外部参照。

## アーキテクチャの重要な点

### 電卓カスタマイザーのデータフロー
`App` が `t`（テーマオブジェクト）を単一の state として管理し、`set(key, value)` 関数を `ControlsPanel` に渡す。`Calculator` は `t` を props として受け取り、それをもとにすべてのスタイルをインライン style で動的に計算する。CSS クラスはレイアウト骨格のみで、デザイントークンはすべて JS で処理される。

### テーマオブジェクト `t` の構造
`DEFAULTS`（`app.jsx` 内）がすべてのキーを定義している。パレット・マテリアル・レイアウト等は文字列キーで参照され、対応する定数マップ（`PALETTES`, `MATERIALS` 等）はすべて `palettes.jsx` に集約されている。

### `index.html`（ルート）と `calculator-kit/` の関係
ルートの `index.html` はすべてのコードを 1 ファイルに統合した配布用。`calculator-kit/` 内のファイルはその元となる開発用の分割版だが、現状 `calculator-kit/index.html` も同じく単一ファイルとして動作する自己完結版になっている（import/export なし）。

## 開発・確認方法

ビルドステップは不要。ブラウザで直接 HTML ファイルを開く。

```
# ルートの電卓カスタマイザーを開く
start index.html

# ネイルサロンのページを開く
start mysite\nail-salon\index.html
```

ローカルサーバーが必要な場合（CORS 等）:
```
npx serve .
# または
python -m http.server 8080
```
