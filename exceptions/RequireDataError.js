module.exports = class RequireDataError extends Error {
    constructor(field) {
        super("Le champ " + field + " doit être fourni pour l'execution de cette requête.");
        this.code = 200
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        //  @see Node.js reference (bottom)
        Error.captureStackTrace(this, this.constructor);
    }
}