/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { CRow, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { Button, Col, Divider, Input, Modal, Row, Select, Table, message, notification } from 'antd'
import axios from 'axios'
import { categories, resto } from 'src/utlls/data'
const { Option } = Select
const { confirm } = Modal

const Product = () => {
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [edit, setEdit] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [val, setVal] = useState({})

  const columns = [
    {
      title: 'Nama Produk',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Asal Produk',
      dataIndex: 'name_resto',
      key: 'name_resto',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'descriptions',
      key: 'descriptions',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a
            onClick={() => {
              setEdit(true)
              setVisible(true)
              setVal({ ...record, id_resto: record.id_resto.toString() })
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              showConfirm(record.id_item)
            }}
          >
            Hapus
          </a>
        </span>
      ),
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:4040/items`)
      if (response.status === 200) {
        setDataTable(response.data.data)
        setIsLoading(false)
      }
    } catch (e) {
      console.log({ e })
      notification.error({
        message: `Failed`,
        description: 'Gagal Mendapatkan Data Produk',
        placement: 'bottomRight',
      })
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const visibleModal = (param) => {
    setEdit(param)
    setVisible(true)
    setVal({})
    setImageUrl('')
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
      const payload = {
        ...val,
        id_resto: Number(val.id_resto),
        image: imageUrl.image,
      }
      const url = edit
        ? `http://localhost:4040/admin_resto/update_item/${val.id_item}`
        : 'http://localhost:4040/admin_resto/input_itemdata'
      const pattern = edit ? axios.put(url, payload, config) : axios.post(url, payload, config)
      const response = await pattern
      if (response.status === 200) {
        notification.success({
          message: `Success`,
          description: 'Input Data Produk Berhasil',
          placement: 'bottomRight',
        })
        setVal({})
        setVisible(false)
        fetchData()
      }
    } catch (e) {
      notification.error({
        message: `Failed`,
        description: 'Gagal Input Data Produk',
        placement: 'bottomRight',
      })
    }
  }

  const handleChange = (e) => {
    const temp = { ...val, ...e }
    setVal(temp)
  }

  const handleChangeImage = (e) => {
    setImageUrl({ image: e.target.files[0] })
  }

  const handleDelete = async (id) => {
    setIsLoading(true)
    try {
      const response = await axios.delete(`http://localhost:4040/admin_resto/item/${id}`)
      console.log({ id })
      if (response.status === 200) {
        notification.success({
          message: `Success`,
          description: 'Hapus Data Produk Berhasil',
          placement: 'bottomRight',
        })
        fetchData()
        setVal({})
        setIsLoading(false)
      }
    } catch (e) {
      console.log({ e })
      setIsLoading(false)
      notification.error({
        message: `Failed`,
        description: 'Gagal Menghapus Data Produk',
        placement: 'bottomRight',
      })
    }
  }

  function showConfirm(id) {
    confirm({
      title: 'Anda Yakin Ingin Menghapus Item Ini ?',
      content: 'Produk Akan Terhapus Secara Permanen',
      onOk() {
        handleDelete(id)
      },
      onCancel() {
        visibleModal(false)
      },
    })
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Daftar Product</CCardHeader>
        <Button
          type="primary"
          style={{ width: '20%', marginLeft: 'auto', marginTop: 20, marginRight: 10 }}
          onClick={() => visibleModal(false)}
        >
          Tambah Product
        </Button>
        <CCardBody>
          <CRow>
            <Table columns={columns} dataSource={dataTable} loading={isLoading} />
          </CRow>
        </CCardBody>
        <Modal
          title={edit ? 'Edit Produk' : 'Tambah Produk'}
          visible={visible}
          onOk={handleSubmit}
          onCancel={handleCancel}
        >
          <Row>
            <Row className="mb-3">
              <Col>
                <span>Kategori</span>
              </Col>
              <Col>
                <Select
                  id={'select'}
                  value={val.id_categories}
                  style={{ width: '100%' }}
                  placeholder="Pilih Kategori"
                  onChange={(v) => handleChange({ id_categories: v })}
                >
                  {categories.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <span>Nama Resto / Mitra</span>
              </Col>
              <Col>
                <Select
                  id={'select'}
                  value={val.id_resto}
                  style={{ width: '100%' }}
                  placeholder="Pilih Resto"
                  onChange={(v) => handleChange({ id_resto: v })}
                >
                  {resto.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <span>Nama Product</span>
              </Col>
              <Col>
                <Input
                  value={val.name}
                  placeholder="Input Nama Produk"
                  onChange={(v) => handleChange({ name: v.target.value })}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <span>Harga</span>
              </Col>
              <Col>
                <Input
                  value={val.price}
                  placeholder="Input Nama Produk"
                  onChange={(v) => handleChange({ price: v.target.value })}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <span>Deskripsi</span>
              </Col>
              <Col>
                <Input.TextArea
                  value={val.descriptions}
                  placeholder="Input Nama Produk"
                  onChange={(v) => handleChange({ descriptions: v.target.value })}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <span>Foto Produk</span>
              </Col>
              <Col className="mt-1">
                <form style={{ marginBottom: 30 }}>
                  <input type="file" name="myImage" onChange={(e) => handleChangeImage(e)} />
                </form>
              </Col>
            </Row>
          </Row>
        </Modal>
      </CCard>
    </>
  )
}

export default Product
