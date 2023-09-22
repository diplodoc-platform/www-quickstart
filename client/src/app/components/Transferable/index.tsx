import React, { FC, memo } from 'react';

export const Transferable: FC<{
    id: string;
    data: string;
}> = memo(({ id, data }) => {
    return (
        <script data-transfer-id={ id } type="application/json">
            { data }
        </script>
    );
});