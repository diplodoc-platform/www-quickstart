import React, { useEffect } from 'react';
import {useModel} from '@modelsjs/react';
import {User} from '~/models/user';

export const Header = () => {
    const user = useModel(User);

    useEffect(() => {
        console.log('Header');
    }, []);

    return (
        <header>
            {user.id && <span>{user.name}</span>}
            {!user.id && <span><a href="/login/github">Sign In</a></span>}
        </header>
    );
};