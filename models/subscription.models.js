import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Subscription Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price:{
        type: Number,
        required: [true, "Subscription Price is required"],
        min: [0,"Price must be grater than 0 "]
    },
    currency:{
        type: String,
        enum:['USD','EUR','GBD'],
        default: 'USD',
    },
    frequency:{
        type: String,
        enum:['daily','weekly','monthly','yearly','others'],
    },
    category:{
        type:String,
        required: [true, "Category is required"],
        enum:['sport','news','politics','entertainments','lefestyle','technology','finance', 'others']
    },
    paymentMethod:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum:['active','canceled','expired'],
        default: 'active',
    },
    startedDate:{
        type: Date,
        required: true,
        validate: {
            validator: (value)=>value <= Date(),
            message: 'Start date must be in the past ',
        }
    },
    renewalDate:{
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;

            },
            message: 'Renewal date must be after the start date ',
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }

},{timestamps: true});

subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate){
        const renewalPeriods ={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        };

        // what the next statement does is it update the renewal date by the period we define
        // jan 1st
        // Monthly
        // 30 days
        // jan 31st
        this.renewaldDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

// Auto-update the status if renewal Date has passed
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription',subscriptionSchema);

export default Subscription;
