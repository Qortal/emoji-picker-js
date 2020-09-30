import { TinyEmitter as Emitter } from 'tiny-emitter';

import { VariantPopup } from './variantPopup';

describe('VariantPopup', () => {
    const emoji = {
        name: 'thumbs up',
        category: 0,
        emoji: '👍',
        variations: ['👍🏻', '👍🏿'],
        version: '11.0'
    };

    let events;
    let container;

    beforeEach(() => {
        events = new Emitter();
        container = new VariantPopup(events, emoji, { style: 'native' }).render();
    });

    test('should render the emoji variants', () => {
        const EmojiPickers = container.querySelectorAll('.emoji-picker__emoji');

        expect(EmojiPickers[0].innerHTML).toEqual(emoji.emoji);
        expect(EmojiPickers[1].innerHTML).toEqual(emoji.variations[0]);
        expect(EmojiPickers[2].innerHTML).toEqual(emoji.variations[1]);
    });
});
