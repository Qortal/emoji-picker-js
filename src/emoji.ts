import { TinyEmitter as Emitter } from 'tiny-emitter';
import twemoji from 'twemoji';

import { EMOJI, HIDE_PREVIEW, SHOW_PREVIEW } from './events';
import { smile } from './icons';
import { save } from './recent';
import { createElement } from './util';

import { CLASS_EMOJI, CLASS_CUSTOM_EMOJI } from './classes';

import { EmojiPickerOptions, EmojiRecord, TwemojiOptions } from './types';

const DEFAULT_TWEMOJI_OPTIONS: TwemojiOptions = {
    ext: '.svg',
    folder: 'svg'
};

export class Emoji {
    private EmojiPicker: HTMLElement;

    private emoji: EmojiRecord;
    private showVariants: boolean;
    private showPreview: boolean;
    private events: Emitter;
    private options: EmojiPickerOptions;
    private twOptions: TwemojiOptions;
    private lazy = true;

    constructor(
        emoji: EmojiRecord,
        showVariants: boolean,
        showPreview: boolean,
        events: Emitter,
        options: EmojiPickerOptions,
        lazy = true
    ) {
        this.emoji = emoji
        this.showVariants = showVariants
        this.showPreview = showPreview
        this.events = events
        this.options = options
        this.lazy = lazy

        // Check for twemojiBaseUrl, if present add to the default options
        options.twemojiBaseUrl ? this.twOptions = { ...DEFAULT_TWEMOJI_OPTIONS, base: options.twemojiBaseUrl } : this.twOptions = { ...DEFAULT_TWEMOJI_OPTIONS }


    }

    render(): HTMLElement {
        this.EmojiPicker = createElement('button', CLASS_EMOJI);

        let content = this.emoji.emoji;

        /*
                    const img = createElement(
                  'img',
                  CLASS_CUSTOM_EMOJI
                ) as HTMLImageElement;
                img.src = element.dataset.emoji;
                element.innerText = '';
                element.appendChild(img);
                element.dataset.loaded = true;
                element.style.opacity = 1;
    */

        if (this.emoji.custom) {
            content = this.lazy
                ? smile
                : `<img class="${CLASS_CUSTOM_EMOJI}" src="${this.emoji.emoji}">`;
        } else if (this.options.style === 'twemoji') {
            content = this.lazy ? smile : twemoji.parse(this.emoji.emoji, this.twOptions);
        }

        this.EmojiPicker.innerHTML = content;
        // this.options.style === 'native'
        //   ? this.emoji.emoji
        //   : this.lazy
        //   ? smile
        //   : twemoji.parse(this.emoji.emoji);
        this.EmojiPicker.tabIndex = -1;

        this.EmojiPicker.dataset.emoji = this.emoji.emoji;
        if (this.emoji.custom) {
            this.EmojiPicker.dataset.custom = 'true';
        }
        this.EmojiPicker.title = this.emoji.name;

        this.EmojiPicker.addEventListener('focus', () => this.onEmojiHover());
        this.EmojiPicker.addEventListener('blur', () => this.onEmojiLeave());
        this.EmojiPicker.addEventListener('click', () => this.onEmojiClick());
        this.EmojiPicker.addEventListener('mouseover', () => this.onEmojiHover());
        this.EmojiPicker.addEventListener('mouseout', () => this.onEmojiLeave());

        if (this.options.style === 'twemoji' && this.lazy) {
            this.EmojiPicker.style.opacity = '0.25';
        }

        return this.EmojiPicker;
    }

    onEmojiClick(): void {
        // TODO move this side effect out of Emoji, make the recent module listen for event
        if (
            (!(this.emoji as EmojiRecord).variations ||
                !this.showVariants ||
                !this.options.showVariants) &&
            this.options.showRecents
        ) {
            save(this.emoji, this.options);
        }

        this.events.emit(EMOJI, {
            emoji: this.emoji,
            showVariants: this.showVariants,
            button: this.EmojiPicker
        });
    }

    onEmojiHover(): void {
        if (this.showPreview) {
            this.events.emit(SHOW_PREVIEW, this.emoji);
        }
    }

    onEmojiLeave(): void {
        if (this.showPreview) {
            this.events.emit(HIDE_PREVIEW);
        }
    }
}
