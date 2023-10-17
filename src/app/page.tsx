'use client'

import Image from 'next/image'
import styles from '@/styles/app/page.module.scss'
import React, { useState } from 'react';
import Link from 'next/link'
import WorkCard from '@/components/Work/WorkCard'
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

interface Tag {
  name: string
}

interface Work {
  name: string,
  author: string,
  description: string,
  thumbnail: string,
  guid: string,
  tags: Tag[]
}



export default function Home() {
  const [randomData, setRandomData] = useState<Work | null>({
    name: "string",
    author: "string",
    description: "string",
    thumbnail: "string",
    guid: "string",
    tags: []
  });
  // setRandomData(works[Math.floor(Math.random() * works.length)])
  // setRandomData(works[Math.floor(Math.random() * works.length)])

  // const [randomData, setRandomData] = useState<Work>()
  const [opened, setOpened] = useState<boolean>(false)

  // let randomData: Work = works[Math.floor(Math.random() * works.length)]
  // setRandomData(works[Math.floor(Math.random() * works.length)])

  // console.log(randomData)

  let worksPath: string = ""
  let worksJsonData: Work[] = []

  invoke('get_user_document_directory')
    .then((res) => {
      console.log(res)
      worksPath = res as string + "\\KCCTGameLauncher\\works.json"
      console.log("w_path:" + worksPath)
    }).catch((e) => {
      console.log("Error")
      console.log(e)
    })


  async function setRandomWork(w: Work[]) {
    // randomData = w[Math.floor(Math.random() * w.length)]
    setRandomData(w[Math.floor(Math.random() * w.length)])
  }

  async function openFile() {
    console.log("OPEN:" + worksPath)

    invoke('read_json_file', {
      filePath: worksPath
    }).then((res) => {
      console.log("OpenSuccess")
      console.log(res)
      worksJsonData = res as Work[]
      setOpened(true)
      setRandomWork(worksJsonData)
    })
      .catch((e) => {
        console.log("Error")
        console.log(e)
      })
  }

  if (typeof window !== 'undefined') {
    if (!opened)
      window.setTimeout(openFile, 10)
  }

  return (
    <div className={styles.field}>
      <div className={styles.movie} onClick={openFile}>
        <p>ようこそ！電算部へ！</p>
      </div>
      <div className={styles.random}>
        <p className={styles.section_name}>Randomに遊びたい！</p>
        <WorkCard workData={randomData as Work} />
      </div>
      <div className={styles.works_link}>
        <p className={styles.section_name}>作品一覧はどこ？</p>
        <Link href="/works/" className={styles.link}><div className={styles.link_box}>こちら</div></Link>
        <Link href="/manage/" className={styles.link}><div className={styles.link_text}>作品を管理</div></Link>
      </div>
      <div className={styles.ranking}>
        <p className={styles.section_name}>よく起動されたもの</p>

      </div>
    </div>
  )
}