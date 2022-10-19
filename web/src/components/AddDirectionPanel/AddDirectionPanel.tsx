import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Container,
  Divider,
  Group,
  Input,
  Space,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import Information from '../Information/Information'

const CREATE_DIRECTION_POST = gql`
  mutation CreateDirectionPost($input: CreateDirectionPostInput!) {
    createDirectionPost(input: $input) {
      id
      feedbackId
    }
  }
`

const CREATE_INFORMATION = gql`
  mutation CreateInformation($input: CreateInformationInput!) {
    createInformation(input: $input) {
      id
    }
  }
`

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

const AddDirectionPanel = () => {
  const { currentUser } = useAuth()
  const [addDirectionPost, AddDirectionState] = useMutation(
    CREATE_DIRECTION_POST
  )

  const [addInformation, AddInformationState] = useMutation(CREATE_INFORMATION)

  const [infoId, setInfoId] = useState<number>(2)

  const [locationA, setLocationA] = useState<string>('anywhere')
  const [locationB, setLocationB] = useState<string>('anywhere')

  const [infoList, setInfoList] = useState<infoType[]>([
    {
      listId: 0,
      title: 'Destination A',
      description: '',
      imageUrl: '',
      location: locationA,
      fare: 0,
      mode: '',
      canBeDeleted: false,
      isUpload: false,
    },
    {
      listId: 1,
      title: 'Destination B',
      description: '',
      imageUrl: '',
      location: locationB,
      fare: 0,
      mode: '',
      canBeDeleted: false,
      isUpload: false,
    },
  ])
  const [description, setDescription] = useState<string>('')

  const AddNewInfo = ({
    title = '',
    description = '',
    imageUrl = '',
    location = '',
    fare = 0,
    mode = '',
    canBeDeleted = true,
    isUpload = false,
  }) => {
    const newInfo: infoType = {
      listId: infoId,
      title: title,
      description: description,
      imageUrl: imageUrl,
      location: location,
      fare: fare,
      mode: mode,
      canBeDeleted: canBeDeleted,
      isUpload: isUpload,
    }
    setInfoId((curr) => curr + 1)
    setInfoList((currInfo) => {
      const index = currInfo.length - 1
      return [...currInfo.slice(0, index), newInfo, ...currInfo.slice(index)]
    })
  }

  const UpdateInfoValues = useCallback((updatedInfo: infoType) => {
    setInfoList((currInfos) => {
      const index = currInfos
        .map((info_) => info_.listId)
        .indexOf(updatedInfo.listId)
      const newInfoList = [
        ...currInfos.slice(0, index),
        updatedInfo,
        ...currInfos.slice(index + 1),
      ]
      return newInfoList
    })
  }, [])

  const deleteInfo = (listId: number) => {
    setInfoList((currInfos) => {
      const index = currInfos.map((info_) => info_.listId).indexOf(listId)
      return [...currInfos.slice(0, index), ...currInfos.slice(index + 1)]
    })
  }

  useEffect(() => {
    setInfoList((currInfo) => {
      return [
        { ...currInfo[0], location: locationA },
        ...currInfo.slice(1, currInfo.length - 1),
        { ...currInfo[currInfo.length - 1], location: locationB },
      ]
    })
  }, [locationA, locationB])

  if (AddDirectionState.loading) return <>{'Submitting...'}</>
  if (AddDirectionState.error)
    return <>{`Submission error! ${AddDirectionState.error.message}`}</>

  if (AddInformationState.loading) return <>{'Submitting...'}</>
  if (AddInformationState.error)
    return <>{`Submission error! ${AddInformationState.error.message}`}</>

  return (
    <div>
      <Container style={{ padding: '10px 0' }}>
        <Divider />
        <Stack spacing={7} style={{ padding: '10px 0' }}>
          <Input.Wrapper label="From:" size="lg">
            <Input
              style={{ padding: '0 15px' }}
              type="text"
              id="locationA"
              placeholder="Destination A"
              defaultValue={locationA}
              onChange={(e) => {
                setLocationA(e.target.value)
              }}
            />
          </Input.Wrapper>
          <Input.Wrapper label="To:" size="lg">
            <Input
              style={{ padding: '0 15px' }}
              type="text"
              id="locationB"
              placeholder="Destination B"
              defaultValue={locationB}
              onChange={(e) => {
                setLocationB(e.target.value)
              }}
            />
          </Input.Wrapper>
          <Space h={5} />
          <Textarea
            style={{ padding: '0 15px' }}
            id="description"
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value)
            }}
          />
        </Stack>
        <Divider />
      </Container>
      <Container>
        <br />
        <ul>
          {infoList.map((info) => (
            <li key={info.listId}>
              <Information
                info={info}
                updateInfoValues={UpdateInfoValues}
                deleteInfo={deleteInfo}
              />
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            AddNewInfo({})
          }}
        >
          Add Information
        </button>

        <button
          disabled={infoList.length <= 2}
          onClick={async () => {
            const dirPost = await addDirectionPost({
              variables: {
                input: {
                  userId: currentUser.id,
                  totalFare: infoList
                    .map((i) => i.fare)
                    .reduce((a, b) => a + b, 0),
                  locationA: locationA,
                  locationB: locationB,
                  description: description,
                },
              },
            })
            await Promise.all(
              infoList.map((e) =>
                addInformation({
                  variables: {
                    input: {
                      directionPostId: dirPost.data.createDirectionPost.id,
                      title: e.title,
                      description: e.description,
                      imageUrl: e.imageUrl,
                      location: e.location,
                      fare: e.fare,
                      mode: e.mode,
                    },
                  },
                })
              )
            )
            navigate(
              routes.direction({
                id: dirPost.data.createDirectionPost.id,
              })
            )
          }}
        >
          SUBMIT
        </button>
      </Container>
    </div>
  )
}

export default AddDirectionPanel
