import React from 'react';
import Styled from 'styled-components';
import Pagination from 'react-bootstrap/Pagination';

import styles from '../themes/theme';

const Styling = Styled.div`
    width: 100%;

    .page-item.active .page-link {
        background-color: ${styles.color1};
        color: white;
        border-color: ${styles.color1};
    }

    .page-link {
        color: ${styles.color1};
    }
`;

const PaginationComponent = props => {
    let active = props.currentPage;
    let pages = [];

    for(let i = 1; i < Math.ceil(props.totalPosts/props.postsPerPage); i++) {
        pages.push(i);
    }

    return (
        <Styling className="d-flex justify-content-center">
            <Pagination>
                { pages.map(page => (
                    <Pagination.Item key={page} active={page === active} onClick={() => props.paginate(page)}>
                        { page }
                    </Pagination.Item>
                ))}
            </Pagination>
        </Styling>
    );
}

export default PaginationComponent;