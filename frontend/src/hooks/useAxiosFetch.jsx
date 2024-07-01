import { useEffect } from "react";
import axios from "axios";

const useAxiosFetch = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/",
  });

  //Interceptors
  useEffect(()=>{
    //request Interceptor
    const requestInterceptor=axios.interceptors.request.use((config)=>{
        //do something before request is sent
        return config;   
    },function(error){
        //do smething with request error
        return Promise.reject(error);
    });

    //response Interceptor
    const responseInterceptor =axios.interceptors.response.use((response)=>{
        //Any status code that lie------
        //Do something with response error
        return response;
    },function(error){
        return Promise.reject(error);
    });

    return ()=>{
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.request.eject(responseInterceptor);

    }
  },[axiosInstance])
  return axiosInstance;
};

export default useAxiosFetch;
