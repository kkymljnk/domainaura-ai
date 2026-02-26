// Module-level mutable store — zero re-renders, readable in useFrame RAF
export const threeStore = {
    inputFocused: false,
    isSubmitting: false,
    isSuccess: false,
    mouseX: 0, // normalized -1 to 1
    mouseY: 0, // normalized -1 to 1
};
