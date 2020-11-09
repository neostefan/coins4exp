import { faBold, faItalic, faUnderline, faStrikethrough, faListOl, faHeading, faListUl,
    faParagraph} from '@fortawesome/free-solid-svg-icons';

const inlineStyles = [
    {
        value: faBold,
        style: 'BOLD'
    },

    {
        value: faUnderline,
        style: 'UNDERLINE'
    },

    {
        value: faItalic,
        style: 'ITALIC'
    },

    {
        value: faStrikethrough,
        style: 'STRIKETHROUGH'
    }
];

const blockStyles = [
    {
        value: faParagraph,
        style: 'paragraph',
        flip: 'horizontal'
    },

    {
        value: faHeading,
        style: 'header-one',
        type: 1
    },

    {
        value: faHeading,
        style: 'header-two',
        type: 2
    },

    {
        value: faHeading,
        style: 'header-three',
        type: 3
    },

    {
        value: faHeading,
        style: 'header-four',
        type: 4
    },

    {
        value: faHeading,
        style: 'header-five',
        type: 5
    },

    {
        value: faHeading,
        style: 'header-six',
        type: 6
    },

    {
        value: faListOl,
        style: 'ordered-list-item'
    },

    {
        value: faListUl,
        style: 'unordered-list-item'
    }
];

export {
    inlineStyles,
    blockStyles
}