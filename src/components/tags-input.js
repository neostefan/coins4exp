import React from 'react';
import Styled from 'styled-components';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../themes/theme';

const Styles = Styled.div`
    .tag-input {
        display: block;
        width: 100%;
        height: auto;
        padding: 5px 5px 1px 5px;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid ${styles.color1};
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    .tag-control {
        border: none;
        width: 100%;
        height: 75%;
        transition: none;
        &:focus {
            outline: none;
            border: none;
        }
    }

    .tag {
        background-color: ${styles.color0};
        color: white;
        height: auto;
        padding: 1px;
        border-radius: 2.5px;
    }

    .close {
        color: white;
        &:hover {
            cursor: pointer;
        }
    }
`;

const TagsInput = props => {
    let [ tags, setTags ] = React.useState(props.tags);

    let handleChange = e => {
        if(e.target.value !== '' && e.key === 'Enter') {
            setTags([...tags, e.target.value]);
            props.selectedTags([...tags, e.target.value]);
            e.target.value = "";
        }
    }

    let removeTag = (index) => {
        let newTags = tags.filter((tag, i) => i !== index);
        setTags([...newTags]);
        props.selectedTags([...newTags]);
    }

    return (
        <Styles>
            <div className="tag-input">
                <div className="d-flex flex-wrap">
                    { tags.map((tag, i) => (
                        <div key={i} className="tag mr-2 mb-2">
                            {tag}
                            <FontAwesomeIcon className="ml-1 close" icon={faWindowClose} 
                            onClick={() => removeTag(i)}/>
                        </div>
                    ))}
                </div>
                <input className="tag-control" onKeyPress={handleChange}/>
            </div>
        </Styles>
    );
}

export default React.memo(TagsInput);