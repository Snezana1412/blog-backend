import {validationResult} from 'express-validator';

export const handle_validation_results = (req, res, next) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors)
        }

        next()
}