import React from "react";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/nprogress.css";
import '../styles/customerStyles.css';
require('dotenv').config();

import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";

import nProgress from "nprogress";
import { Router } from "next/router";

function MyApp({ Component, pageProps }: { Component: React.ElementType; pageProps: any }) {
	Router.events.on("routeChangeStart", nProgress.start);
	Router.events.on("routeChangeError", nProgress.done);
	Router.events.on("routeChangeComplete", nProgress.done);
	
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.jpeg" />
			</Head>


			<NextUIProvider>
				<Component {...pageProps} />
			</NextUIProvider>

		</>
	);
}

export default MyApp;
