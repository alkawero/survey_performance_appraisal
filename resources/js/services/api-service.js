import axios from 'axios'
import store from '../store'

let api_host = 'api_url'
if(process.env.MIX_APP_ENV=='LOCAL'){
    api_host = process.env.MIX_APP_URL_LOCAL+'/api/'
}else
if(process.env.MIX_APP_ENV=='DEV'){
    api_host = process.env.MIX_APP_URL_DEV+'/api/'
}else
if(process.env.MIX_APP_ENV=='PROD'){
    api_host = process.env.MIX_APP_URL_PROD+'/api/'
}


export const doGetExternalApi = async(url) =>{
  return await axios.get(url)
      .then((rsp)=>{
        return{data:rsp.data, error:''}
        })
      .catch((error)=>{
        return {data:'', error:error}
        });
}

export const doGet = async(path,params={}) =>{
  return await axios.get(api_host+path,{
    params:params
  })
      .then((rsp)=>{
        return{data:rsp.data}
        })
      .catch((error)=>{
        console.log(path)
        console.log(error)
        return {error:error}
        });
}


export const doPost = async(path,payload,activity) =>{
  return await axios({
        method: 'post',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        return {data:rsp.data}})
      .catch((error)=>{
        console.log(error)
      })
}

export const doSilentPost = async(path,payload) =>{
  return await axios({
        method: 'post',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        return {data:rsp.data}})
      .catch((error)=>{
        console.log(error)
      })
}


export const doUpload = async(path,payload) =>{
  return await axios({
        method: 'post',
        url: api_host+path,
        data: payload,
        headers:{'content-type': 'multipart/form-data' }
      })
      .then((rsp)=>{
        return rsp
      })
      .catch((error)=>{

        console.log(error)
      })
}

export const doPut = async(path,payload,activity) =>{
  return await axios({
        method: 'put',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        return {data:rsp.data}})
      .catch((error)=>{
        console.log(error)
      })
}

export const doPatch = async(path,payload,activity) =>{
  return await axios({
        method: 'patch',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        return {data:rsp.data}})
      .catch((error)=>{
        console.log(error)
      })
}

export const doDelete = async(path,payload,activity) =>{
  return await axios({
        method: 'delete',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        return {data:rsp.data}})
      .catch((error)=>{
        console.log(error)
      })
}



export const doDownloadExcel = async(path,params={}) =>{
    return await axios.get(api_host+path,{
        params:params,
        responseType: 'blob',
        headers: { 'Accept': 'application/vnd.ms-excel' }
      }).then((rsp)=>{
            const url = window.URL.createObjectURL(new Blob([rsp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', params.file_name+'.xlsx');
            document.body.appendChild(link);
            link.click();
        })
        .catch((error)=>{
          console.log(error)
        })
  }

  export const doDownloadPdf = async(path,params={}) =>{
    return await axios.get(api_host+path,{
      params:params,
      responseType: 'blob'
    })
        .then((rsp)=>{
          const url = window.URL.createObjectURL(new Blob([rsp.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'file.pdf'); //or any other extension
          document.body.appendChild(link);
          link.click();
          })
        .catch((error)=>{
          console.log(path)
          console.log(error)
          return {error:error}
          });
  }

