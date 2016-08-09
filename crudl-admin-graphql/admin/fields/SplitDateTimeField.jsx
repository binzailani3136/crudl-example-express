import React from 'react'

class SplitDateTimeField extends React.Component {

    static propTypes = {
        getTime: React.PropTypes.func.isRequired,
        getDate: React.PropTypes.func.isRequired,
    }

    render() {
        const customDateFieldStyle = {
            display: 'inline-block',
            width: '24%',
            marginRight: '2%'
        }
        const customTimeFieldStyle = {
            display: 'inline-block',
            width: '24%'
        }
        const { desc, formField, disabled, getTime, getDate } = this.props
        return (
            <div className="field">
                <input
                    id={desc.id + '-date'}
                    type="text"
                    autoComplete="off"
                    readOnly={true}
                    disabled={disabled}
                    value={getDate(formField.value)}
                    style={customDateFieldStyle}
                    />
                <input
                    id={desc.id + '-time'}
                    type="text"
                    autoComplete="off"
                    readOnly={true}
                    disabled={disabled}
                    value={getTime(formField.value)}
                    style={customTimeFieldStyle}
                    />
                <input type="hidden" readOnly={true} {...formField} />
            </div>
        )
    }
}

export default crudl.BaseField(SplitDateTimeField)
