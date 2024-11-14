// import { Categories } from 'components/Categories';
import {Fooders}  from 'components/Fooders';
import React from 'react';
import styles from '../styles/foods.module.css'
// import { Categories } from '@/';
// import styles from './index.module.css';


const Foods: React.FC = () => {
    return (
        <div className={styles.cont}>                                                           
            {/* <Categories/> */}
            <Fooders    />
        </div>
    );
};

export default Foods;
