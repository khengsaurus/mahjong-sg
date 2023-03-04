import { CustomFade, SampleTile } from 'components';
import { EEvent, Transition } from 'enums';
import { useWindowListener } from 'hooks';
import { useState } from 'react';
import { Column, Row } from 'style/StyledComponents';
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
			onMouseEnter={() => setShowDecoration(hoverEffect)}
			onMouseLeave={() => setShowDecoration(false)}
		>
			<Column>
				{hoverEffect && showOnHover[1] && (
					<CustomFade show={showDecoration} timeout={timeout}>
						<SampleTile
							className={`top ${showDecoration ? 'show' : ''}`}
							card={showOnHover[1]}
						/>
					</CustomFade>
				)}
				<Row>
					{hoverEffect && showOnHover[0] && (
						<CustomFade show={showDecoration} timeout={timeout}>
							<SampleTile
								className={`left ${showDecoration ? 'show' : ''}`}
								card={showOnHover[0]}
							/>
						</CustomFade>
					)}
					<Button />
					{hoverEffect && showOnHover[2] && (
						<CustomFade show={showDecoration} timeout={timeout}>
							<SampleTile
								className={`right ${showDecoration ? 'show' : ''}`}
								card={showOnHover[2]}
							/>
						</CustomFade>
					)}
				</Row>
			</Column>
		</div>
	);
};

export default DecorButton;
