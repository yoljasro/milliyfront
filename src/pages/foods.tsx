// import { Categories } from 'components/Categories';
import {Fooders}  from 'components/Fooders';
import Products from 'components/Products';
import React from 'react';
// import { Categories } from '@/';
// import styles from './index.module.css';


const Foods: React.FC = () => {
    return (
        <div>
            {/* <Categories/> */}
            <Fooders addToCart={Products}/>
        </div>
    );
};

export default Foods;
