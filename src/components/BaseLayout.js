import React from 'react';
import { useMachine } from '@xstate/react';
import bookingmachine from '../Machines/bookingMachine';

 export const BaseLayout = () => {
     const [state, send]=useMachine(bookingmachine);
     console.log('nuestra maquina', state)
    return (
        <div>hola</div>
    );
}

export default BaseLayout;