import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu } from '@/components/Menu';
import { Categories } from '@/components/Categories';
import { Fooders } from '@/components/Fooders';
// import styles from './index.module.css';


const Foods: React.FC = () => {
    return (
        <div>
            <Categories/>
            <Fooders/>
        </div>
    );
};

export default Foods;
