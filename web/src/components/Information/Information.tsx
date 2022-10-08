import { useEffect, useMemo, useState } from 'react'

import InformationImageUpload from '../InformationImageUpload/InformationImageUpload'
type infoType = {
  listId: number
  title: string
  description: string
  imageUrl: string
  location: string
  fare: number
  mode: string
  canBeDeleted: boolean
  isUpload: boolean
}

type propType = {
  info: infoType
  updateInfoValues: (updatedInfo: infoType) => void
  deleteInfo: (listId: number) => void
}

const Information = ({ info, updateInfoValues, deleteInfo }: propType) => {
  const [title, setTitle] = useState(info.title)
  const [description, setDescription] = useState(info.description)
  const [imageUrl, setImageUrl] = useState(info.imageUrl)
  const [mode, setMode] = useState(info.mode)
  // const [location, setLocation] = useState(info.location)
  const [fare, setFare] = useState(info.fare)

  const [isUpload, setIsUpload] = useState(info.isUpload)

  const updatedInfo = useMemo(() => {
    return {
      listId: info.listId,
      title: title,
      description: description,
      imageUrl: imageUrl,
      location: info.location,
      fare: fare,
      mode: mode,
      canBeDeleted: info.canBeDeleted,
      isUpload: isUpload,
    }
  }, [
    description,
    fare,
    imageUrl,
    info.canBeDeleted,
    info.listId,
    info.location,
    isUpload,
    mode,
    title,
  ])

  useEffect(() => {
    updateInfoValues(updatedInfo)
  }, [updateInfoValues, updatedInfo])

  return (
    <div style={{ padding: '1rem' }}>
      {info.canBeDeleted ? (
        <button onClick={() => deleteInfo(info.listId)}>Delete</button>
      ) : (
        <></>
      )}
      <form>
        <input
          type="text"
          id="title"
          value={title}
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        <br />
        <textarea
          id="description"
          value={description}
          placeholder="Description"
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          cols={40}
          rows={5}
        />
        <br />
        <input
          type="text"
          id="mode"
          value={mode}
          placeholder="Mode of Transportation"
          onChange={(e) => {
            setMode(e.target.value)
          }}
        />
        <br />
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          placeholder="Image URL"
          onChange={(e) => {
            setImageUrl(e.target.value)
          }}
        />

        <br />
        <label>Loc: {info.location}</label>
        <br />
        <input
          type="number"
          id="fare"
          value={fare}
          placeholder="Fare Price"
          onChange={(e) => {
            setFare(+e.target.value)
          }}
        />
        <br />

        <InformationImageUpload
          imageState={{ imageUrl, setImageUrl }}
          isUploadState={{ isUpload, setIsUpload }}
        />
      </form>
    </div>
  )
}

export default Information
