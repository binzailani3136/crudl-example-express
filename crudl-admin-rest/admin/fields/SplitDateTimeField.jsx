import React from 'react'

class SplitDateTimeField extends React.Component {

    static propTypes = {
        getTime: React.PropTypes.func.isRequired,
        getDate: React.PropTypes.func.isRequired,
    }

    render() {
        const { desc, formField, disabled, getTime, getDate } = this.props
        return (
            <div>
                <input
                    id={desc.id + '-date'}
                    type="text"
                    autoComplete="off"
                    readOnly={true}
                    disabled={disabled}
                    value={getDate(formField.value)}
                    />
                <input
                    id={desc.id + '-time'}
                    type="text"
                    autoComplete="off"
                    readOnly={true}
                    disabled={disabled}
                    value={getTime(formField.value)}
                    />
                <input type="hidden" readOnly={true} {...formField} />
            </div>
        )
    }
}

export default Crudl.BaseField(SplitDateTimeField)
