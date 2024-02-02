import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

function DropZone() {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <form>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here...</p> : <p>Drag and drop some files here, or click to select files</p>}
      </div>
    </form>
  )
}

export default DropZone
