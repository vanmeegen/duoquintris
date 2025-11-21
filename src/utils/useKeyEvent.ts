import { onMounted, onUnmounted } from 'vue';

export const useKeyEvent = (
    eventType: 'keydown' | 'keyup',
    key: string,
    handler: (event: KeyboardEvent) => void
) => {
    onMounted(() => {
        window.addEventListener(eventType, (event) => {
            if (event.key === key) {
                handler(event);
            }
        });
    });

    onUnmounted(() => {
        window.removeEventListener(eventType, handler);
    });
};
