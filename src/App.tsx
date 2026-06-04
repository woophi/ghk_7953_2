import { BottomSheet } from '@alfalab/core-components/bottom-sheet/cssm';
import { Button } from '@alfalab/core-components/button/cssm';
import { Gap } from '@alfalab/core-components/gap/cssm';
import { PureCell } from '@alfalab/core-components/pure-cell/cssm';
import { Tag } from '@alfalab/core-components/tag/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import { ChevronRightMIcon } from '@alfalab/icons-glyph/ChevronRightMIcon';
import { useEffect, useMemo, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import smileImg from './assets/smile.png';
import { useStocksData } from './hooks/useStocksData';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';
import { formatWord, getWordEnding } from './utils/words';

export const App = () => {
  const [category, setCategory] = useState<'all' | string>('all');
  const [openBs, setOpenBs] = useState(false);
  const [view, setView] = useState<'all-O' | 'all-B' | 'cats'>('cats');

  const { stocks } = useStocksData();

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
    window.gtag('event', '7953_landing_impression', { var: 'var2' });
  }, []);

  const categories = Array.from(new Set(stocks.map(item => item.category)));

  const viewByCategory = useMemo(() => {
    if (category === 'all') {
      const topBpifs = stocks.filter(item => item.type === 'B').slice(0, 3);
      const topBpifsSorted = [...topBpifs].sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit));

      const topOpifs = stocks.filter(item => item.type === 'O').slice(0, 3);
      const topOpifsSorted = [...topOpifs].sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit));

      return (
        <>
          <Typography.Text view="primary-medium" color="secondary">
            2 типа фондов
          </Typography.Text>

          <PureCell
            className={appSt.box}
            onClick={() => {
              window.gtag('event', '7953_about_click', { var: 'var2' });

              setOpenBs(true);
            }}
          >
            <PureCell.Graphics verticalAlign="center">
              <img src={smileImg} width={40} height={40} alt="smile" />
            </PureCell.Graphics>
            <PureCell.Content>
              <PureCell.Main>
                <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                  Что такое инвестиционный фонд?
                </Typography.Text>
              </PureCell.Main>
            </PureCell.Content>
          </PureCell>

          <div className={appSt.row}>
            <Typography.TitleMobile tag="h3" weight="medium" view="medium">
              ОПИФ
            </Typography.TitleMobile>
          </div>
          <Typography.Text view="primary-medium">
            Открытые паевые фонды — управляющий сам инвестирует ваши деньги в акции и облигации. Вы получаете доход — без
            биржи и брокерского счёта
          </Typography.Text>

          <div className={appSt.boxCard}>
            {topOpifs.map((item, index) => (
              <PureCell
                key={index}
                onClick={() => {
                  window.gtag('event', '7953_product_click', {
                    var: 'var2',
                    answer: item.name,
                    section: 'Все типы',
                  });
                  window.location.replace(item.link);
                }}
                className={appSt.topProfit({
                  selected: topOpifsSorted[0].ticker === item.ticker,
                })}
              >
                <PureCell.Graphics verticalAlign="center">
                  <img src={item.icon} width={48} height={48} alt={item.name} style={{ objectFit: 'cover' }} />
                </PureCell.Graphics>
                <PureCell.Content>
                  <PureCell.Main>
                    <Typography.Text view="primary-small" tag="p" defaultMargins={false} weight="medium">
                      {item.name}
                    </Typography.Text>
                    <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
                      От {item.minSum.toLocaleString('ru-RU')} ₽
                    </Typography.Text>
                  </PureCell.Main>
                </PureCell.Content>
                <PureCell.Addon verticalAlign="center">
                  <Typography.TitleMobile tag="h3" weight="medium" view="xsmall" color="positive">
                    {item.profit}
                  </Typography.TitleMobile>
                </PureCell.Addon>
                <PureCell.Addon verticalAlign="center">
                  <ChevronRightMIcon color="#BABBC2" width={14} height={14} />
                </PureCell.Addon>
              </PureCell>
            ))}
          </div>

          <Button
            view="primary"
            onClick={() => {
              window.gtag('event', '7953_show_all_click', { var: 'var2', answer: 'ОПИФ' });
              setView('all-O');
            }}
          >
            Показать все
          </Button>

          <div className={appSt.row} style={{ marginTop: '1rem' }}>
            <Typography.TitleMobile tag="h3" weight="medium" view="medium">
              БПИФ
            </Typography.TitleMobile>

            <div className={appSt.tag({ variant: 'secondary' })}>Нужен брокерский счёт</div>
          </div>
          <Typography.Text view="primary-medium">
            Биржевой паевой фонд. Торгуется как акция — покупаете и продаёте в любой момент дня. Нужен брокерский счёт
          </Typography.Text>

          <div className={appSt.boxCard}>
            {topBpifs.map((item, index) => (
              <PureCell
                key={index}
                onClick={() => {
                  window.gtag('event', '7953_product_click', {
                    var: 'var2',
                    answer: item.name,
                    section: 'Все типы',
                  });
                  window.location.replace(item.link);
                }}
                className={appSt.topProfit({
                  selected: topBpifsSorted[0].ticker === item.ticker,
                })}
              >
                <PureCell.Graphics verticalAlign="center">
                  <img src={item.icon} width={48} height={48} alt={item.name} style={{ objectFit: 'cover' }} />
                </PureCell.Graphics>
                <PureCell.Content>
                  <PureCell.Main>
                    <Typography.Text view="primary-small" tag="p" defaultMargins={false} weight="medium">
                      {item.name}
                    </Typography.Text>
                    <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
                      От {item.minSum.toLocaleString('ru-RU')} ₽
                    </Typography.Text>
                  </PureCell.Main>
                </PureCell.Content>
                <PureCell.Addon verticalAlign="center">
                  <Typography.TitleMobile tag="h3" weight="medium" view="xsmall" color="positive">
                    {item.profit}
                  </Typography.TitleMobile>
                </PureCell.Addon>
                <PureCell.Addon verticalAlign="center">
                  <ChevronRightMIcon color="#BABBC2" width={14} height={14} />
                </PureCell.Addon>
              </PureCell>
            ))}
          </div>

          <Button
            view="primary"
            onClick={() => {
              window.gtag('event', '7953_show_all_click', { var: 'var2', answer: 'БПИФ' });
              setView('all-B');
            }}
          >
            Показать все
          </Button>
          <Button
            view="primary"
            onClick={() => {
              window.gtag('event', '7953_ba_open_click', { var: 'var2' });
              const link = 'alfabank://multistep-route?version=2&fromModule=FORM&alias=brokerage-account-open-alias';

              window.location.replace(link);
            }}
          >
            Открыть брокерский счёт
          </Button>
        </>
      );
    }

    const stocksByCategory = stocks.filter(item => item.category === category);
    const stocksO = stocksByCategory.filter(item => item.type === 'O');
    const stocksB = stocksByCategory.filter(item => item.type === 'B');

    return (
      <>
        <div />
        {stocksO.length > 0 && (
          <>
            <div className={appSt.row}>
              <Typography.TitleMobile tag="h3" weight="medium" view="medium">
                ОПИФ
              </Typography.TitleMobile>
            </div>

            <Typography.Text view="primary-medium" color="secondary">
              {formatWord(stocksO.length, ['тип', 'типа', 'типов'])}{' '}
              {getWordEnding(stocksO.length, ['фонда', 'фонда', 'фондов'])}
            </Typography.Text>

            {stocksO.map(item => (
              <PureCell
                key={item.ticker + item.name}
                onClick={() => {
                  window.gtag('event', '7953_product_click', {
                    var: 'var2',
                    answer: item.name,
                    section: category,
                  });
                  window.location.replace(item.link);
                }}
                className={appSt.cell}
              >
                <PureCell.Graphics verticalAlign="center">
                  <img src={item.icon} width={48} height={48} alt={item.name} style={{ objectFit: 'cover' }} />
                </PureCell.Graphics>
                <PureCell.Content>
                  <PureCell.Main>
                    <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                      {item.name}
                    </Typography.Text>
                  </PureCell.Main>
                </PureCell.Content>
                <PureCell.Addon verticalAlign="center">
                  <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                    {item.profit}
                  </Typography.Text>
                </PureCell.Addon>
              </PureCell>
            ))}
          </>
        )}

        {stocksB.length > 0 && (
          <>
            <div className={appSt.row} style={{ marginTop: '1rem' }}>
              <Typography.TitleMobile tag="h3" weight="medium" view="medium">
                БПИФ
              </Typography.TitleMobile>

              <div className={appSt.tag({ variant: 'secondary' })}>Нужен брокерский счёт</div>
            </div>

            <Typography.Text view="primary-medium" color="secondary">
              {formatWord(stocksB.length, ['тип', 'типа', 'типов'])}{' '}
              {getWordEnding(stocksB.length, ['фонда', 'фонда', 'фондов'])}
            </Typography.Text>

            {stocksB.map(item => (
              <PureCell
                key={item.ticker + item.name}
                onClick={() => {
                  window.gtag('event', '7953_product_click', {
                    var: 'var2',
                    answer: item.name,
                    section: category,
                  });
                  window.location.replace(item.link);
                }}
                className={appSt.cell}
              >
                <PureCell.Graphics verticalAlign="center">
                  <img src={item.icon} width={48} height={48} alt={item.name} style={{ objectFit: 'cover' }} />
                </PureCell.Graphics>
                <PureCell.Content>
                  <PureCell.Main>
                    <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                      {item.name}
                    </Typography.Text>
                  </PureCell.Main>
                </PureCell.Content>
                <PureCell.Addon verticalAlign="center">
                  <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                    {item.profit}
                  </Typography.Text>
                </PureCell.Addon>
              </PureCell>
            ))}
          </>
        )}
      </>
    );
  }, [category, stocks]);

  if (view === 'all-O') {
    const stocksO = stocks.filter(item => item.type === 'O');

    return (
      <>
        <div className={appSt.container}>
          <div className={appSt.row} style={{ marginTop: '1rem' }}>
            <Typography.TitleMobile tag="h3" weight="medium" view="medium">
              ОПИФ
            </Typography.TitleMobile>
          </div>
          <Typography.Text view="primary-medium">
            Открытые паевые фонды — управляющий сам инвестирует ваши деньги в акции и облигации. Вы получаете доход — без
            биржи и брокерского счёта
          </Typography.Text>

          <Typography.Text view="primary-medium" color="secondary">
            {formatWord(stocksO.length, ['фонда', 'фонда', 'фондов'])}
          </Typography.Text>

          {stocksO.map(item => (
            <PureCell
              key={item.ticker + item.name}
              onClick={() => {
                window.gtag('event', '7953_product_click', {
                  var: 'var2',
                  answer: item.name,
                  section: 'Все опифы',
                });
                window.location.replace(item.link);
              }}
              className={appSt.cell}
            >
              <PureCell.Graphics verticalAlign="center">
                <img src={item.icon} width={48} height={48} alt={item.name} style={{ objectFit: 'cover' }} />
              </PureCell.Graphics>
              <PureCell.Content>
                <PureCell.Main>
                  <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                    {item.name}
                  </Typography.Text>
                </PureCell.Main>
              </PureCell.Content>
              <PureCell.Addon verticalAlign="center">
                <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                  {item.profit}
                </Typography.Text>
              </PureCell.Addon>
            </PureCell>
          ))}
        </div>
        <Gap size={96} />

        <div className={appSt.bottomBtn}>
          <Button
            view="primary"
            size={56}
            onClick={() => {
              setView('cats');
            }}
            block
          >
            Ко всем типам фондов
          </Button>
        </div>
      </>
    );
  }
  if (view === 'all-B') {
    const stocksB = stocks.filter(item => item.type === 'B');

    return (
      <>
        <div className={appSt.container}>
          <div className={appSt.row} style={{ marginTop: '1rem' }}>
            <Typography.TitleMobile tag="h3" weight="medium" view="medium">
              БПИФ
            </Typography.TitleMobile>

            <div className={appSt.tag({ variant: 'secondary' })}>Нужен брокерский счёт</div>
          </div>
          <Typography.Text view="primary-medium">
            Биржевой паевой фонд. Торгуется как акция — покупаете и продаёте в любой момент дня. Нужен брокерский счёт
          </Typography.Text>

          <Typography.Text view="primary-medium" color="secondary">
            {formatWord(stocksB.length, ['фонда', 'фонда', 'фондов'])}
          </Typography.Text>

          {stocksB.map(item => (
            <PureCell
              key={item.ticker + item.name}
              onClick={() => {
                window.gtag('event', '7953_product_click', {
                  var: 'var2',
                  answer: item.name,
                  section: 'Все бпифы',
                });
                window.location.replace(item.link);
              }}
              className={appSt.cell}
            >
              <PureCell.Graphics verticalAlign="center">
                <img src={item.icon} width={48} height={48} alt={item.name} style={{ objectFit: 'cover' }} />
              </PureCell.Graphics>
              <PureCell.Content>
                <PureCell.Main>
                  <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                    {item.name}
                  </Typography.Text>
                </PureCell.Main>
              </PureCell.Content>
              <PureCell.Addon verticalAlign="center">
                <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                  {item.profit}
                </Typography.Text>
              </PureCell.Addon>
            </PureCell>
          ))}
        </div>
        <Gap size={96} />

        <div className={appSt.bottomBtn}>
          <Button
            view="primary"
            size={56}
            onClick={() => {
              window.gtag('event', '7953_show_all_fonds_click', { var: 'var2' });

              setView('cats');
            }}
            block
          >
            Ко всем типам фондов
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={appSt.container}>
        <Typography.TitleMobile style={{ marginTop: '1rem' }} tag="h1" view="medium" weight="medium">
          Инвестиционные фонды
        </Typography.TitleMobile>
        <Typography.Text view="primary-medium">
          Вкладываете деньги — фонд работает за вас. Выберите подходящий тип
        </Typography.Text>

        <div>
          <Swiper
            slidesPerView="auto"
            spaceBetween={8}
            modules={[Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
          >
            <SwiperSlide style={{ width: 'fit-content' }}>
              <Tag
                checked={category === 'all'}
                onClick={() => {
                  window.gtag('event', '7953_tab_click', { var: 'var2', answer: 'Все типы' });
                  setCategory('all');
                }}
                view={category !== 'all' ? 'filled' : undefined}
                size={40}
              >
                Все типы
              </Tag>
            </SwiperSlide>
            {categories.map(cat => (
              <SwiperSlide key={cat} style={{ width: 'fit-content' }}>
                <Tag
                  key={cat}
                  checked={category === cat}
                  onClick={() => {
                    window.gtag('event', '7953_tab_click', { var: 'var2', answer: cat });

                    setCategory(cat);
                  }}
                  view={category !== cat ? 'filled' : undefined}
                  size={40}
                >
                  {cat}
                </Tag>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {viewByCategory}
      </div>
      <Gap size={48} />

      {category !== 'all' && (
        <>
          <Gap size={48} />
          <div className={appSt.bottomBtn}>
            <Button
              view="primary"
              size={56}
              onClick={() => {
                setCategory('all');
              }}
              block
            >
              Ко всем типам фондов
            </Button>
          </div>
        </>
      )}

      <BottomSheet
        open={openBs}
        onClose={() => {
          setOpenBs(false);
        }}
        hasCloser
        title="Что такое инвестиционный фонд?"
        titleAlign="left"
        stickyHeader
      >
        <div className={appSt.container} style={{ padding: 0 }}>
          <Typography.Text view="primary-medium">
            ПИФ — это инструмент коллективных инвестиций. Он объединяет деньги клиентов-инвесторов и направляет их на покупку
            финансовых активов: акций, облигаций, валюты. Надзор за деятельностью ПИФов осуществляет Банк России. Пай — это
            доля в капитале фонда
          </Typography.Text>
        </div>
      </BottomSheet>
    </>
  );
};
