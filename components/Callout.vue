<template>
    <div>
        <LightOrDark>
            <template #dark>
                <div w="full" border="~ main rounded-md" flex="~" pl="1.5 rem" bg="dark">
                    <div w="30px">
                        <p>
                            <slot name="icon"></slot>
                        </p>
                    </div>
                    <div pl="~ 0.5rem">
                        <slot name="default"></slot>
                    </div>
                </div>
            </template>
            <template #light>
                <div w="full" border="~ main rounded-md" flex="~" pl="1.5 rem" bg="light">
                    <div w="30px">
                        <p>
                            <slot name="icon"></slot>
                        </p>
                    </div>
                    <div pl="~ 0.5rem">
                        <slot name="default"></slot>
                </div>
            </div>
        </template>
    </LightOrDark>
</div></template>