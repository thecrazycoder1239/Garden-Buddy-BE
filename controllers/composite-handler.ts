const request = require("axios")
const app = require("../app");

const returnOrderedPromiseChain = (arr, currentInd)  => {
    if (currentInd < arr.length - 1) {
        return arr[currentInd]
    .then((result) => {
        return Promise.all([result, returnOrderedPromiseChain(arr, currentInd+1)])
    }).then(([result, newArray] ) => {
        return [result, ...newArray]
    })
    } else {
        return arr[currentInd]
        .then((result) => {
            return [result]
        })
    }
    
}

const handleComposition = (req, res, next) => {
   const {compositeRequest} = req.body;
   if(!compositeRequest) {
    next({msg: "Missing compositeRequest field, requires key of compositeRequest"})
   } else if (!Array.isArray(compositeRequest)) {
    next({msg: "compositeRequest value must be an array"})
   } else if (!compositeRequest[0]) {
    next({msg: "compositeRequest array must contain at least 1 request"})
   } else if (
    !compositeRequest.every((singleRequest) => {
        if (typeof singleRequest !== "object") return false
        if (!singleRequest.method) return false 
        if (!singleRequest.ref) return false
        if (!singleRequest.path) return false
        return true
    })
   ) 
   {
    next({msg: "compositeRequest requests must contain ref, method and path"})
   }
   else {
       
    const promiseArray =  compositeRequest.map((singleCompRequest) => {
   
        const options = {
            method: singleCompRequest.method,
            url: `http://localhost:${process.env.PORT}${singleCompRequest.path}`,
            headers: {"content-type": "application/json"},
            data: singleCompRequest.body,
            validateStatus: () => true
        }
        
        return request(options)
       
        .then((response) => {
            return {
                ref: singleCompRequest.ref,
                body: response.data,
                success: true,
                status: response.status
            }
        })
      })
    
      returnOrderedPromiseChain(promiseArray, 0)
      .then((result) => {
        res.status(200).send({compositeResponse: result})
      })
   }
  
   
   

   
    
}

module.exports = handleComposition