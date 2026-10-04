class APIerror extends Error {
  constructor(
    statusCode,
    message,
    errors = [],
    stacks = ''
  ){
    super(message)
    this.statusCode = statusCode;
    (
      (this.data = null),
      (this.errors = errors),
      (this.message = message),
      (this.success = false )
    )
    if(stacks){
      this.stacks = stacks;
    }else{
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default APIerror