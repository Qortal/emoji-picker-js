import { TinyEmitter as Emitter } from 'tiny-emitter';

import twemoji from 'twemoji';

import { SHOW_PREVIEW, HIDE_PREVIEW } from './events';
import { createElement } from './util';
import { EmojiRecord, EmojiPickerOptions, TwemojiOptions } from './types';

import { CLASS_PREVIEW, CLASS_PREVIEW_EMOJI, CLASS_PREVIEW_NAME, CLASS_CUSTOM_EMOJI } from './classes';

const DEFAULT_TWEMOJI_OPTIONS: TwemojiOptions = {
    ext: '.svg',
    folder: 'svg'
};

export class EmojiPreview {
    private emoji: HTMLElement;
    private name: HTMLElement;

    private options: EmojiPickerOptions;
    private twOptions: TwemojiOptions;

    constructor(private events: Emitter, options: EmojiPickerOptions) {

        this.options = options

        // Check for twemojiBaseUrl, if present add to the default options
        options.twemojiBaseUrl ? this.twOptions = { ...DEFAULT_TWEMOJI_OPTIONS, base: options.twemojiBaseUrl } : this.twOptions = { ...DEFAULT_TWEMOJI_OPTIONS }

    }

    render(): HTMLElement {
        const preview = createElement('div', CLASS_PREVIEW);

        this.emoji = createElement('div', CLASS_PREVIEW_EMOJI);
        preview.appendChild(this.emoji);

        this.name = createElement('div', CLASS_PREVIEW_NAME);
        preview.appendChild(this.name);

        this.events.on(SHOW_PREVIEW, (emoji: EmojiRecord) =>
            this.showPreview(emoji)
        );
        this.events.on(HIDE_PREVIEW, () => this.hidePreview());

        return preview;
    }

    showPreview(emoji: EmojiRecord): void {
        let content = emoji.emoji;

        if (emoji.custom) {
            content = `<img class="${CLASS_CUSTOM_EMOJI}" src="${emoji.emoji}">`;
        } else if (this.options.style === 'twemoji') {
            content = twemoji.parse(emoji.emoji, this.twOptions);
        }

        this.emoji.innerHTML = content;
        this.name.innerHTML = emoji.name;
    }

    hidePreview(): void {
        this.emoji.innerHTML = '';
        this.name.innerHTML = '';
    }
}
