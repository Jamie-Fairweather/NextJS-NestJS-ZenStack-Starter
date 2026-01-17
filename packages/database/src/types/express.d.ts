declare global {
    namespace express {
        interface Request {
            user?: { id: string }
        }
    }
}

export {}
