import mongoose from 'mongoose'

const aboutSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    detail: {
        type: String,
        require: true,
    },
    prof: {
        type: String,
        require: true,
    },
})
export const AboutModel = new mongoose.model('about', aboutSchema);


const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phono: {
        type: String,
        require: true,
    },
})
export const AddressModel = mongoose.model('address', addressSchema);

const resumeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    time: {
        type: String,
        require: true,
    },
    college: {
        type: String,
        require: true,
    }
})
export const ResumeModel = mongoose.model('resume', resumeSchema)

const skillScheme = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    skill_img: {
        type: String,
        require: true
    },
})
export const SkillModel = mongoose.model('skills', skillScheme)