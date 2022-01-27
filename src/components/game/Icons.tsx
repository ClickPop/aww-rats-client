import type { FC } from 'react';
import { Icon, IconProps } from '@chakra-ui/icons';
import { GameIconTypes } from '~/types/game';
interface GameIconProps extends IconProps {
  icon: GameIconTypes | string;
}

export const EnergyIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon color='yellow.300' viewBox='0 0 41.95 57.59' {...rest}>
    <polygon
      fill='currentColor'
      points='41.95 24.79 22.7 24.79 28.73 0 0 32.35 17.38 32.56 10.98 57.59 41.95 24.79'
    />
  </Icon>
);

export const StrengthIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 56.13 60.6' {...rest}>
    <g id="skin">
      <path d="M52.26,48C41.29,57.4,25.9,59.64,5.85,59.52c0,0-3.74,1.15-4.6-3.56,0,0-.77-20.89,3.81-35.55,0,0-.19-6,0-9.9a2.57,2.57,0,0,1,.83-1.75c5.76-5.32,8.35-6.1,8.35-6.1l8.37-1.48c1.32.91,4.23,4.18,3.75,10l.1-.4,3.22.9a2.76,2.76,0,0,1,1.84,2.65c0,1.17-2.8,2-2.8,2l-6.12,1.38c-1.83,2.88-5.6,3.18-7.28,3.1-.09-.24-.59,0-.19,0,.59,1.5,1.28,5.11,1.92,11.81l.17,1.86c.05.52.32,4.73.39,7.47,1.81-4.41,6.63-12.56,15.73-13.84a20.94,20.94,0,0,1,20.17,8.49,5.72,5.72,0,0,1,.52.77A8.32,8.32,0,0,1,52.26,48Z" fill="#fcea2b"/>
      <path d="M15.66,20.61c-.41,0-.74-.06-.94-.09l.64-.49A2.07,2.07,0,0,1,15.66,20.61Z" fill="#fcea2b"/>
      <path d="M15.66,20.61c-.41,0-.74-.06-.94-.09l.64-.49A2.07,2.07,0,0,1,15.66,20.61Z" fill="#fcea2b"/>
    </g>
    <g id="skin-shadow">
      <path d="M11.07,20s5.35-5,1.62-6.38l12.76-.42.67-1.14.22-1.85c1.07.18,3.36.95,3.64,1,0,0,2.41,1.88.45,4.1l-7.78,2.23A14.92,14.92,0,0,1,11.07,20Z" fill="#f1b31c"/>
      <path d="M11.07,20c.8,9.21,2.56,25.64,2.07,27.74,0,.7.66.81,1,.3A14.13,14.13,0,0,0,18,42.87c0-5.76-.66-12.46-2.22-22.26C15.18,19,12.82,19,11.07,20Z" fill="#f1b31c"/>
      <path d="M37.35,27.9s10.24,7,3.11,16.42c0,0,2.13,8.51.15,9.85S61.23,48.62,52.75,35.6A19.71,19.71,0,0,0,37.35,27.9Z" fill="#f1b31c"/>
    </g>
    <g id="line">
      <path d="M16.62,34.35c-.43-4.28-1.13-12.72-2-13.76,0,0,5.2,1.11,7.81-3" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M23.65,46.88s10.81,2.7,19.29-4.32" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M16.87,44.43S19.74,30,33.24,28a21,21,0,0,1,20.21,8.52,6.27,6.27,0,0,1,.53.77,8.35,8.35,0,0,1-1.8,10.56c-11,9.47-26.43,11.72-46.52,11.6,0,0-3.75,1.15-4.61-3.57,0,0-.77-20.94,3.82-35.63,0,0-.2-6,0-9.93A2.58,2.58,0,0,1,5.72,8.6C11.5,3.27,14.1,2.48,14.1,2.48L22.49,1c1.43,1,4.72,4.74,3.57,11.5" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M14.74,13.09s1.82,2.59,3.63-.28v-3l-.46-1.66-.36-.28" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M18.7,13.09s1.81,2.59,3.63-.28v-3l-.87-2.13" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M26,12.81c-2,1.89-3.32,0-3.32,0" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M14.39,13.09" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M9.45,10.24a3.69,3.69,0,0,1,1.28,2.44,1.26,1.26,0,0,0,.34.77c.59.59,2,1.52,3.32-.64v-3l-.64-1.27" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M29.51,12.08c1.92.57,2.26,3.43-.7,4.1l-6.33,1.44" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </g>
  </Icon>
);

export const AttackIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 37.82 47.77' {...rest}>
    <g id="color">
      <g id="_2694" data-name=" 2694">
        <path d="M29.87,49.89s3.88-.19,1.57-2.94a27.39,27.39,0,0,1-10-5.33s-3.6,1.09-1,3.25A44.16,44.16,0,0,1,29.87,49.89Z" transform="translate(-17.09 -12.12)" fill="#9b9b9a"/>
        <path d="M43.91,13.21a25.7,25.7,0,0,1-2.71,9.58L29.91,44.6a22.81,22.81,0,0,1-4.52-2.41L37.27,20.68a25.65,25.65,0,0,1,6.46-7.56" transform="translate(-17.09 -12.12)" fill="#d0cfce"/>
        <path d="M18.33,55.94a2,2,0,1,0,3.52,1.89,90,90,0,0,0,3.85-10l-1.18-.63A87.59,87.59,0,0,0,18.33,55.94Z" transform="translate(-17.09 -12.12)" fill="#9b9b9a"/>
        <path d="M51.52,44.87c2.62-2.16-1-3.25-1-3.25a27.39,27.39,0,0,1-10,5.33c-2.31,2.75,1.57,2.94,1.57,2.94A44.16,44.16,0,0,1,51.52,44.87Z" transform="translate(-17.09 -12.12)" fill="#9b9b9a"/>
        <path d="M29.27,14.12a25.65,25.65,0,0,1,6.46,7.56L47.61,43.19a22.81,22.81,0,0,1-4.52,2.41L31.79,23.79a25.87,25.87,0,0,1-2.7-9.58" transform="translate(-17.09 -12.12)" fill="#d0cfce"/>
        <path d="M53.67,55.94a2,2,0,1,1-3.52,1.89,90,90,0,0,1-3.85-10l1.18-.63A87.59,87.59,0,0,1,53.67,55.94Z" transform="translate(-17.09 -12.12)" fill="#9b9b9a"/>
      </g>
    </g>
    <g id="line">
      <g id="_2694-2" data-name=" 2694-2">
        <g>
          <path d="M40.34,46.54h0a2,2,0,0,0,1.89,3.52" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M51.62,45a2,2,0,1,0-1.89-3.52h0" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M51.62,45a22.21,22.21,0,0,0-9.39,5" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M40.34,46.54a22.1,22.1,0,0,0,9.39-5" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        </g>
        <path d="M53.67,55.94a2,2,0,1,1-3.52,1.89,90,90,0,0,1-3.85-10l1.18-.63A87.59,87.59,0,0,1,53.67,55.94Z" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <path d="M28.27,13.12a25.65,25.65,0,0,1,6.46,7.56L46.92,42.77a22.34,22.34,0,0,1-4.52,2.42L30.79,22.79a25.87,25.87,0,0,1-2.7-9.58" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <g>
          <path d="M29.77,50.06a2,2,0,0,0,1.89-3.52h0" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M22.27,41.52h0A2,2,0,1,0,20.38,45h0" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M29.77,50.06a22.21,22.21,0,0,0-9.39-5" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M22.27,41.52a22.1,22.1,0,0,0,9.39,5" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        </g>
        <g>
          <path d="M37.7,20a30.93,30.93,0,0,1,6-6.83" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M34.34,36,29.6,45.19a22.34,22.34,0,0,1-4.52-2.42l6.36-11.52" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          <path d="M43.91,13.21a25.7,25.7,0,0,1-2.71,9.58l-.91,1.75" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        </g>
        <path d="M18.33,55.94a2,2,0,1,0,3.52,1.89,90,90,0,0,0,3.85-10l-1.18-.63A87.59,87.59,0,0,0,18.33,55.94Z" transform="translate(-17.09 -12.12)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
  </Icon>
);

export const RewardIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 43.72 51.56' {...rest}>
    <g id="color">
      <path d="M56.72,40A20.71,20.71,0,0,1,37.53,60.7C53,51.68,54.84,36,42.15,21.18L42,21c-3.27-3.78,1.44-9.8,1.44-9.8h2a3.25,3.25,0,0,1,3.24,3.24v0a3.21,3.21,0,0,1-.69,2,3.18,3.18,0,0,1-1.29,1h0c-1.17,1.16-2.2,3.13.8,5.35l.11.08a3.64,3.64,0,0,1,.35.24,20.37,20.37,0,0,1,4,3.64,19.69,19.69,0,0,1,2.69,4.13,2,2,0,0,1,.11.21c.15.33.29.65.42,1s.21.54.3.8.19.55.27.81v0l.22.76,0,.13c0,.12.06.22.08.34a3.59,3.59,0,0,1,.12.47c0,.16.07.3.1.46l.09.39s0,0,0,.05c0,.29.1.56.14.82s.09.69.13,1,0,.41.05.58C56.73,39.54,56.72,40,56.72,40Z" transform="translate(-14 -10.2)" fill="#6a462f" stroke="#6a462f" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M37.53,60.7l-.5,0c-.34,0-.69,0-1,0A20.72,20.72,0,0,1,15.28,40v-.13c0-.28,0-.55,0-.83,0-.12,0-.24,0-.38s0-.37.05-.58.07-.55.12-.86c0-.15.05-.31.07-.48a26.7,26.7,0,0,1,.8-3.29c.06-.19.13-.4.21-.61.21-.58.45-1.18.73-1.79a1,1,0,0,1,.11-.21,34.92,34.92,0,0,1,2.69-4.13,20.37,20.37,0,0,1,3.95-3.64,3.64,3.64,0,0,1,.35-.24l.11-.08c2.95-2.19,2-4.14.85-5.3a3.16,3.16,0,0,1-1.46-1.11l0,0a3.22,3.22,0,0,1-.62-1.9v0A3.25,3.25,0,0,1,26.5,11.2H43.44s-4.71,6-1.44,9.8l.15.18C54.84,36,53,51.68,37.53,60.7Z" transform="translate(-14 -10.2)" fill="#a57939" stroke="#a57939" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </g>
    <g id="line">
      <path d="M16.49,34.82c.09-.46.19-.91.32-1.36C16.68,33.94,16.58,34.39,16.49,34.82Z" transform="translate(-14 -10.2)"/>
      <path d="M17.08,32.53c-.1.31-.18.62-.27.93Q16.93,33,17.08,32.53Z" transform="translate(-14 -10.2)"/>
      <path d="M16.31,35.7c.05-.28.11-.58.18-.88C16.43,35.11,16.36,35.4,16.31,35.7Z" transform="translate(-14 -10.2)"/>
      <path d="M16,44.58" transform="translate(-14 -10.2)"/>
      <path d="M16.06,37.91c0,.27,0,.53,0,.8C16,38.56,16,38.29,16.06,37.91Z" transform="translate(-14 -10.2)"/>
      <line x1="28.36" y1="9.63" x2="15.52" y2="9.63" fill="none" stroke="#000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"/>
      <path d="M56.72,40a20.72,20.72,0,0,1-41.44,0v-.13c0-.28,0-.55,0-.83,0-.12,0-.24,0-.38s0-.37.05-.58.07-.55.12-.86c0-.15.05-.31.07-.48a26.7,26.7,0,0,1,.8-3.29c.06-.19.13-.4.21-.61.21-.58.45-1.18.73-1.79a1,1,0,0,1,.11-.21,34.92,34.92,0,0,1,2.69-4.13,20.74,20.74,0,0,1,3.95-3.65l.35-.23.11-.08c2.95-2.19,2-4.14.85-5.3a3.16,3.16,0,0,1-1.46-1.11l0,0a3.22,3.22,0,0,1-.62-1.9v0A3.25,3.25,0,0,1,26.5,11.2H45.43a3.25,3.25,0,0,1,3.24,3.24v0a3.21,3.21,0,0,1-.69,2,3.18,3.18,0,0,1-1.29,1h0c-1.17,1.16-2.2,3.13.8,5.35l.11.08.35.23a20.74,20.74,0,0,1,4,3.65,19.69,19.69,0,0,1,2.69,4.13,2,2,0,0,1,.11.21c.15.33.29.65.42,1s.21.54.3.8.19.55.27.81v0l.22.76,0,.13c0,.12.06.22.08.34a3.59,3.59,0,0,1,.12.47c0,.16.07.3.1.46s.07.26.09.39,0,0,0,.05c0,.29.1.56.14.82s.09.69.13,1,0,.41.05.58C56.73,39.54,56.72,40,56.72,40Z" transform="translate(-14 -10.2)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M39.19,36.36a2.83,2.83,0,0,0-2.85-1.85h0a2.66,2.66,0,0,0-2.91,2.31,2.66,2.66,0,0,0,2.91,2.32h-.06a2.66,2.66,0,0,1,2.91,2.32,2.66,2.66,0,0,1-2.91,2.32h0a2.83,2.83,0,0,1-2.85-1.85" transform="translate(-14 -10.2)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <line x1="22.31" y1="24.31" x2="22.31" y2="22.09" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <line x1="22.31" y1="35.8" x2="22.31" y2="33.59" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M22,20s-6,0-6,6" transform="translate(-14 -10.2)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <path d="M17,18a2,2,0,0,1-2-2" transform="translate(-14 -10.2)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </g>
  </Icon>
);

export const PlusIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 250.05 250.05' {...rest}>
    <path
      id='plus'
      d='M241.05,116H134V9a9,9,0,0,0-18,0V116H9a9,9,0,0,0,0,18H116v107a9,9,0,0,0,18,0V134h107a9,9,0,0,0,0-18Z'
      fill='#444545'
    />
  </Icon>
);

export const PetRatIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 271.41 223.61' {...rest}>
    <g id='heart'>
      <path
        d='M296.82,550.44a9,9,0,0,1-6-2.32L187.62,455l-.34-.31c-28.88-28.89-26.76-57.2-22.93-71.5,6.71-25,28.54-45.9,55.61-53.15s55.08-.34,77.85,19c23-19.66,51.28-26.73,78.65-19.4,27.17,7.28,48.22,27.36,54.93,52.38,3.82,14.25,5.89,42.47-23.14,71.5l-.35.33L302.83,548.14A9,9,0,0,1,296.82,550.44Zm-97-108.65,97,87.54,98.85-88.69c16.65-16.73,23.15-35.88,18.31-53.94-5-18.55-21.53-34.11-42.2-39.65-23.56-6.31-48.21,1.2-67.62,20.62a9,9,0,0,1-12.73,0c-19.13-19.13-43.49-26.51-66.83-20.26-21,5.63-37.81,21.49-42.89,40.43C176.87,406,183.3,425.16,199.85,441.79Z'
        transform='translate(-162.15 -326.83)'
        fill='#444545'
      />
    </g>
    <g id='footprint'>
      <rect
        x='265.71'
        y='383.87'
        width='23.46'
        height='34.58'
        rx='10.95'
        transform='translate(-240.78 -259.02) rotate(-12.22)'
        fill='#c571ae'
      />
      <rect
        x='234.2'
        y='414.81'
        width='23.69'
        height='34.58'
        rx='10.95'
        transform='translate(-345.23 -145.92) rotate(-30)'
        fill='#c571ae'
      />
      <rect
        x='310.07'
        y='383.87'
        width='24.28'
        height='34.58'
        rx='10.95'
        transform='translate(390.07 534.61) rotate(-167.78)'
        fill='#c571ae'
      />
      <rect
        x='337.96'
        y='409.83'
        width='22.98'
        height='34.58'
        rx='10.95'
        transform='translate(276.38 644.92) rotate(-150)'
        fill='#c571ae'
      />
      <rect
        x='111.12'
        y='106.3'
        width='51.13'
        height='48.91'
        rx='14.63'
        fill='#c571ae'
      />
    </g>
  </Icon>
);

export const StreetRatIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 216.13 144.46' {...rest}>
    <path
      id='glasses'
      d='M216,67a8,8,0,0,0-3-7.68L138.6,1.7a8,8,0,0,0-9.79,12.66L191.3,62.73l-.94-.67c2.22,2.3-.92,3.43-2,3.74H152.44c-.63,0-1.25,0-1.88,0H65.44c-.63,0-1.25,0-1.88,0H27.65c-1.09-.32-4.07-1.44-2-3.67l61.75-47.8A8,8,0,0,0,77.62,1.67L3.19,59.29A8,8,0,0,0,.1,65.85h0v9.66A9.54,9.54,0,0,0,0,76.83v30.85a36.82,36.82,0,0,0,36.78,36.78h19A43.27,43.27,0,0,0,99,101.25a35.85,35.85,0,0,0-.59-6.43l.06.2s-1.45-7,3.11-7.84h12.26c5.25.33,3.69,7.9,3.69,7.9l0-.13a35.4,35.4,0,0,0-.57,6.3,43.27,43.27,0,0,0,43.21,43.21h19A36.82,36.82,0,0,0,216,107.68V76.2c0-.12,0-.23,0-.35h0ZM96.12,87.27l0-.09h0Z'
      fill='#444545'
    />
    <g id='flares'>
      <g id='flare'>
        <path
          d='M53.2,136a7.5,7.5,0,0,1-.88-15C67.93,119.19,75.16,110,74.43,92.9a7.5,7.5,0,1,1,15-.64c1.06,24.95-11.81,40.88-35.32,43.7A6.8,6.8,0,0,1,53.2,136Z'
          fill='#55a4db'
        />
      </g>
      <g id='flare-2' data-name='flare'>
        <path
          d='M172.79,137.9a7.5,7.5,0,0,1-.88-14.94c15.61-1.88,22.84-11.09,22.11-28.18a7.5,7.5,0,0,1,15-.64c1.06,25-11.81,40.89-35.31,43.71A7,7,0,0,1,172.79,137.9Z'
          fill='#55a4db'
        />
      </g>
    </g>
  </Icon>
);

export const PackRatIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 180 248.63' {...rest}>
    <path
      id='bag'
      d='M133.57,37.27a42.8,42.8,0,0,0-11.72-23.73A44,44,0,0,0,90.61,0a44.56,44.56,0,0,0-32,13.13A42.73,42.73,0,0,0,46.43,37.28,90,90,0,0,0,0,116V237.42a11.23,11.23,0,0,0,11.22,11.21H168.78A11.23,11.23,0,0,0,180,237.42V116A90.07,90.07,0,0,0,133.57,37.27ZM69.92,24.4A28.47,28.47,0,0,1,90.39,16a28.08,28.08,0,0,1,20,8.66,27.42,27.42,0,0,1,3.59,4.58A89.58,89.58,0,0,0,90,26h0a89.91,89.91,0,0,0-23.92,3.23A28.28,28.28,0,0,1,69.92,24.4ZM90,44a72.08,72.08,0,0,1,72,72V222.56c-.73,5.69-3.62,7.5-5.57,8.07H25.08c-1.62-.12-6.65-1.21-7-10.06l0,3.92V116A72.08,72.08,0,0,1,90,44Z'
      fill='#444545'
    />
    <g id='pocket'>
      <rect x='36' y='161' width='108' height='54' rx='12' fill='#e16944' />
    </g>
  </Icon>
);

export const LabRatIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon viewBox='0 0 199.27 261' {...rest}>
    <g id='fluid'>
      <path
        d='M78.74,166.94,49.06,217.47A5,5,0,0,0,53.37,225H144a5,5,0,0,0,4.34-7.48L119.52,167a10,10,0,0,0-8.69-5H87.36A10,10,0,0,0,78.74,166.94Z'
        fill='#009247'
      />
      <circle cx='81.64' cy='67.5' r='22.5' fill='#079247' />
      <circle cx='117.64' cy='22.5' r='22.5' fill='#079247' />
    </g>
    <g id='beaker'>
      <path
        d='M194.4,215.91l-47.92-71.86a11.07,11.07,0,0,1-1.84-6.11V116.19a23,23,0,0,0,14-21.19V82a23,23,0,0,0-23-23h-72a23,23,0,0,0-23,23V95a23,23,0,0,0,14,21.15v21.79a11,11,0,0,1-1.85,6.11L4.88,215.91A29,29,0,0,0,6.8,250.68,29.43,29.43,0,0,0,29.49,261H169.78a29.41,29.41,0,0,0,22.69-10.32A29,29,0,0,0,194.4,215.91ZM180,237.19a10.85,10.85,0,0,1-9.7,5.81H29a11,11,0,0,1-9.15-17.1L67.77,154a29,29,0,0,0,4.87-16.09V118h0V104a4,4,0,0,0-4-4h-5a5,5,0,0,1-5-5V82a5,5,0,0,1,5-5h72a5,5,0,0,1,5,5V95a5,5,0,0,1-5,5h-5a4,4,0,0,0-4,4v5l0,0v28.94A28.88,28.88,0,0,0,131.51,154l47.91,71.87A10.85,10.85,0,0,1,180,237.19Z'
        fill='#444545'
      />
    </g>
  </Icon>
);

export const GameIcon: FC<GameIconProps> = ({ icon, ...rest }) => {
  switch (icon) {
    case GameIconTypes.Energy:
    case 'energy':
      return <EnergyIcon {...rest} />;
    case GameIconTypes.Strength:
    case 'strength':
      return <StrengthIcon {...rest} />;
    case GameIconTypes.Attack:
    case 'attack':
      return <AttackIcon {...rest} />;
    case GameIconTypes.Reward:
    case 'reward':
      return <RewardIcon {...rest} />;
    case GameIconTypes.Plus:
    case 'plus':
      return <PlusIcon {...rest} />;
    case GameIconTypes.PetRat:
    case 'petrat':
      return <PetRatIcon {...rest} />;
    case GameIconTypes.PackRat:
    case 'packrat':
      return <PackRatIcon {...rest} />;
    case GameIconTypes.LabRat:
    case 'labrat':
      return <LabRatIcon {...rest} />;
    case GameIconTypes.StreetRat:
    case 'streetrat':
      return <StreetRatIcon {...rest} />;
    default:
      return <></>;
  }
}