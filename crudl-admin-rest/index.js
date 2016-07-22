import options from './admin/options'
import descriptor from './admin/descriptor'
import SplitDateTimeField from './admin/fields/SplitDateTimeField'

crudl.addField('SplitDateTime', SplitDateTimeField)
crudl.render(descriptor, options)
