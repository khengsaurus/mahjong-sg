import { Fade } from '@mui/material';
import { SampleTile } from 'components/Tiles';
import { EEvent, Transition } from 'enums';
import { useWindowListener } from 'hooks';
import { useState } from 'react';
import { Column, Row } from 'style/StyledComponents';
import { isMobile } from 'utility';
import './decorButton.scss';

export interface IDecorButtonP {
	Button: React.FC;
	hoverEffect?: boolean;
	showOnHover?: string[];
}

const timeout = { enter: Transition.SLOW, exit: Transition.FAST };

const DecorButton = ({ Button, hoverEffect = true, showOnHover = [] }: IDecorButtonP) => {
	const [showDecoration, setShowDecoration] = useState(false);

	useWindowListener(EEvent.CLICK, () => setShowDecoration(false));

	return (
		<div
			className="container"
			onMouseEnter={() => setShowDecoration(hoverEffect && !isMobile() && true)}
			onMouseLeave={() => {
				if (!isMobile()) {
					setShowDecoration(false);
				}
			}}
		>
			<Column>
				{hoverEffect && !isMobile() && showOnHover[1] && (
					<Fade in={showDecoration} timeout={timeout}>
						<div>
							<SampleTile className={`top ${showDecoration ? 'show' : ''}`} card={showOnHover[1]} />
						</div>
					</Fade>
				)}
				<Row>
					{hoverEffect && !isMobile() && showOnHover[0] && (
						<Fade in={showDecoration} timeout={timeout}>
							<div>
								<SampleTile className={`left ${showDecoration ? 'show' : ''}`} card={showOnHover[0]} />
							</div>
						</Fade>
					)}
					<Button />
					{hoverEffect && !isMobile() && showOnHover[2] && (
						<Fade in={showDecoration} timeout={timeout}>
							<div>
								<SampleTile className={`right ${showDecoration ? 'show' : ''}`} card={showOnHover[2]} />
							</div>
						</Fade>
					)}
				</Row>
			</Column>
		</div>
	);
};

export default DecorButton;
