import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

function TinyMceEditor(props) {
  const {editorRef,name,initValue,other}=props
  return (

    <Editor
       apiKey='r023ozj14cipaeqld5ilznuyj7yk6dn6l3mxo5dhkk1xk1e9'
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={initValue}
            name={name}
            
            init={{
              height: 350,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help | code',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        {...other}/>
  )
}

export default TinyMceEditor