import React from 'react';
import Styled from 'styled-components';
import Pagination from 'react-bootstrap/Pagination';

import Aux from '../hoc/aux';
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

    for(let i = 1; i < Math.ceil(props.totalPosts/props.postsPerPage) + 1; i++) {
        pages.push(i);
    }

    return (
        <Styling className="d-flex justify-content-center">
            <Pagination>
                { pages.length <= 3 ? pages.map((page, i, arr) => (
                    <Pagination.Item key={page} active={page === active} onClick={() => props.paginate(page)}>
                        {page}
                    </Pagination.Item>
                )) : 
                    <Aux>
                        {(active === 1) ? null : <Pagination.Prev onClick={() => props.paginate(active-1)}/>}
                        <Pagination.Item>
                            { active }
                        </Pagination.Item>
                        {(active === pages.length) ? null : <Pagination.Next onClick={() => props.paginate(active+1)}/>}
                    </Aux>
                }
            </Pagination>
        </Styling>
    );
}

export default PaginationComponent;