import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import httpComman from '../../../api/httpComman';
import Heading from '../../components/Heading/Heading';
import { Form, Input } from 'antd';
import FormButton from '../../components/Button/FormButton/FormButton';
import InputText from '../../components/Input/InputText/InputText';
import { setinfo} from '../../slices/mainSlice'

const PersonalDetail = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { info } = useSelector((s) => s.all)
    
    const value = {
            name: info.name,
            profession: info.prof,
            about: info.detail,
    }

    const field = [
        {
            name: "name",
            label: "Name",
            type: "text",
            message: "Please, Enter your name !"
        },
        {
            name: "profession",
            label: "Profession",
            type: "text",
            message: "Please, Enter your Profession !"
        },
    ]

    const onFinish = async () => {
        setLoading(true)

        setLoading(false)
    }
    useEffect(() => {
        const fetchinfo = async () => {
            const res = await httpComman.get('/about')
            const apiData = res.data;
            if (apiData && apiData.length > 0) {
                const fetchedData = apiData[0];
                dispatch(setinfo(fetchedData))
            }
        }
        fetchinfo();
    }, [])


    return (
        <>
            <div className="admin-container">
                <Heading heading="My Address" />
                <div className="w-full">
                    <Form
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"
                        className='p-5 py-10 mx-auto'
                        initialValues={value}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {field.map((item, i) => (
                                <InputText {...item} key={i} style="focus:border-2 font-semibold text-lg focus:border-gray-800 placeholder:text-gray-600" />
                            ))}
                        </div>
                        <Form.Item
                            label="About"
                            name="about"
                            rules={[
                                {
                                    required: true,
                                    message: "Please, Enter your Address !",
                                },
                            ]}
                        >
                            <Input.TextArea className='focus:border-2 font-semibold text-lg focus:border-gray-800 placeholder:text-gray-600' placeholder="About" rows={4} />
                        </Form.Item >
                        <FormButton title="Update" loading={loading} />
                    </Form>
                </div>
            </div>
        </>
    )
}

export default PersonalDetail